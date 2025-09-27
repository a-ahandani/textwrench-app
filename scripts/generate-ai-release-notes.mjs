#!/usr/bin/env node
/*
  AI Release Notes Generator

  Generates user-facing release notes by summarizing commits between the previous and current tag.
  Steps:
    1. Collect commit subjects & bodies (no merges).
    2. Attempt AI summarization (OpenAI Chat API) if OPENAI_API_KEY present.
    3. Fallback to conventional grouping if AI unavailable/fails.

  Environment variables:
    OPENAI_API_KEY    (optional) enables AI summarization
    OPENAI_BASE_URL   (optional) override API base URL (default https://api.openai.com)
    AI_MODEL          (default: gpt-4o-mini)
    MODEL_PROVIDER    (default: openai, set 'none' to force fallback)
*/

import { execSync } from 'node:child_process'

const MODEL = process.env.AI_MODEL || 'gpt-4o-mini'
const PROVIDER = process.env.MODEL_PROVIDER || 'openai'
const OPENAI_BASE_URL = (process.env.OPENAI_BASE_URL || 'https://api.openai.com').replace(/\/$/, '')

function run(cmd) {
  return execSync(cmd, { encoding: 'utf8' }).trim()
}

function safeRun(cmd) {
  try {
    return run(cmd)
  } catch {
    return ''
  }
}

function getLastTag() {
  return (
    safeRun('git describe --tags --abbrev=0 HEAD^ 2>/dev/null') ||
    safeRun('git describe --tags --abbrev=0') ||
    ''
  )
}

const currentTag = process.argv[2] || safeRun('git describe --tags --exact-match 2>/dev/null')
const previousTag = getLastTag()
const range = previousTag ? `${previousTag}..${currentTag}` : currentTag

function getCommits() {
  const format = '%H%x01%s%x01%b%x02'
  const raw = safeRun(`git log ${range} --no-merges --pretty=format:"${format}"`)
  if (!raw) return []
  return raw
    .split('\x02')
    .filter(Boolean)
    .map((line) => {
      const [hash, subject, body] = line.split('\x01')
      return { hash, subject: subject?.trim() || '', body: body?.trim() || '' }
    })
}

function classify(subject) {
  const lower = subject.toLowerCase()
  if (/^feat[:(]/.test(lower)) return 'features'
  if (/^fix[:(]/.test(lower)) return 'fixes'
  if (/^perf[:(]/.test(lower)) return 'performance'
  if (/^refactor[:(]/.test(lower)) return 'refactors'
  if (/^docs[:(]/.test(lower)) return 'docs'
  if (/^chore[:(]/.test(lower)) return 'chore'
  if (/^test[:(]/.test(lower)) return 'tests'
  return 'other'
}

const commits = getCommits()

function detectBreaking() {
  return commits.some((c) => /BREAKING CHANGE|!/.test(c.subject) || /BREAKING CHANGE/i.test(c.body))
}

function buildFallbackNotes() {
  if (!commits.length) return 'No changes.'
  const groups = {}
  for (const c of commits) {
    const key = classify(c.subject)
    groups[key] = groups[key] || []
    groups[key].push(c)
  }
  const order = ['features', 'fixes', 'performance', 'refactors', 'docs', 'tests', 'chore', 'other']
  let out = `## Changes\n`
  for (const key of order) {
    if (!groups[key]) continue
    const title = key.charAt(0).toUpperCase() + key.slice(1)
    out += `\n### ${title}\n`
    for (const c of groups[key]) {
      out += `- ${c.subject}\n`
    }
  }
  if (detectBreaking()) {
    out += `\n### Potential Breaking Changes\n- Review commits marked with '!' or containing 'BREAKING CHANGE'.`
  }
  return out.trim()
}

async function callAI(prompt) {
  if (PROVIDER === 'none') return null
  if (!process.env.OPENAI_API_KEY) return null
  const https = await import('node:https')
  const body = JSON.stringify({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2
  })
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: OPENAI_BASE_URL.replace(/^https?:\/\//, ''),
        path: '/v1/chat/completions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Length': Buffer.byteLength(body)
        }
      },
      (res) => {
        let data = ''
        res.on('data', (d) => {
          data += d
        })
        res.on('end', () => {
          try {
            const json = JSON.parse(data)
            const content = json.choices?.[0]?.message?.content?.trim()
            resolve(content || null)
          } catch (e) {
            resolve(null)
          }
        })
      }
    )
    req.on('error', () => resolve(null))
    req.write(body)
    req.end()
  })
}

function buildPrompt() {
  // Limit commits to avoid over-long prompts
  const MAX_COMMITS = 120
  const truncated = commits.slice(0, MAX_COMMITS)
  const omitted = commits.length - truncated.length
  const commitList = truncated
    .map((c) => `- ${c.subject}${c.body ? `\n  ${c.body.replace(/\n/g, ' ')}` : ''}`)
    .join('\n')
  return `You are an assistant generating release notes for end-users. Produce concise, user-facing release notes with:\n1. A short summary paragraph (<=3 sentences).\n2. Categorized bullet sections: Features, Fixes, Improvements, Refactors, Performance, Docs, Other (omit empty).\n3. A 'Potential Breaking Changes' section ONLY if clearly implied.\n4. Focus on user impact; avoid internal-only noise.\n${omitted > 0 ? `\n[Note: ${omitted} older commits omitted for brevity]\n` : ''}\nCommits since previous release (${previousTag || 'none'} -> ${currentTag || 'working tree'}):\n${commitList}`
}

async function main() {
  const fallback = buildFallbackNotes()
  if (!commits.length) {
    console.log(fallback)
    return
  }
  let ai = null
  try {
    ai = await callAI(buildPrompt())
  } catch (_) {}
  const header = `# Release Notes for ${currentTag}\n\n`
  const output = ai ? `${header}${ai.trim()}` : `${header}${fallback}`
  console.log(output)
}

main()
