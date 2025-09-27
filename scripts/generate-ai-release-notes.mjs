#!/usr/bin/env node
/* eslint-disable @typescript-eslint/explicit-function-return-type */
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

/**
 * Execute a shell command and return trimmed stdout.
 * @param {string} cmd
 * @returns {string}
 */
function run(cmd) {
  return execSync(cmd, { encoding: 'utf8' }).trim()
}

/**
 * Safe command execution returning empty string on failure.
 * @param {string} cmd
 * @returns {string}
 */
function safeRun(cmd) {
  try {
    return run(cmd)
  } catch {
    return ''
  }
}

/**
 * Get the previous tag reachable from HEAD.
 * @returns {string}
 */
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

/**
 * Collect commit metadata between tags.
 * @returns {{hash:string,subject:string,body:string}[]}
 */
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

/**
 * Classify a commit subject into a category.
 * @param {string} subject
 * @returns {string}
 */
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

/**
 * Detect potential breaking changes.
 * @returns {boolean}
 */
function detectBreaking() {
  return commits.some((c) => /BREAKING CHANGE|!/.test(c.subject) || /BREAKING CHANGE/i.test(c.body))
}

/**
 * Build fallback (non-AI) release notes.
 * @returns {string}
 */
function buildFallbackNotes() {
  if (!commits.length) return 'No changes.'
  const groups = {}
  for (const c of commits) {
    const key = classify(c.subject)
    groups[key] = groups[key] || []
    groups[key].push(c)
  }
  const order = ['features', 'fixes', 'performance', 'refactors', 'docs', 'tests', 'chore', 'other']
  let out = '## Changes\n'
  for (const key of order) {
    if (!groups[key]) continue
    const title = key.charAt(0).toUpperCase() + key.slice(1)
    out += `\n### ${title}\n`
    for (const c of groups[key]) {
      out += `- ${c.subject}\n`
    }
  }
  if (detectBreaking()) {
    out +=
      '\n### Potential Breaking Changes\n- Review commits marked with ! or containing "BREAKING CHANGE".'
  }
  return out.trim()
}

/**
 * Call AI provider to generate notes.
 * @param {string} prompt
 * @returns {Promise<string|null>}
 */
async function callAI(prompt) {
  if (PROVIDER === 'none') return null
  if (!process.env.OPENAI_API_KEY) return null
  const https = await import('node:https')
  const body = JSON.stringify({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2
  })
  return new Promise((resolve) => {
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
          } catch {
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

/**
 * Build AI prompt from commits.
 * @returns {string}
 */
function buildPrompt() {
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

  /**
   * Sanitize & normalize AI generated content.
   * - Remove any leading level-1/2 headings referencing release notes or the version.
   * - Collapse excess blank lines.
   * - Ensure a trailing newline.
   * - If missing a summary line (starts directly with a heading / list), prepend a minimal summary derived from fallback.
   * @param {string} text
   */
  function sanitizeAI(text) {
    if (!text) return ''
    let lines = text.split(/\r?\n/)
    // Drop BOM or whitespace
    lines = lines.map((l) => l.replace(/^\uFEFF/, ''))
    // Remove leading empty lines
    while (lines.length && !lines[0].trim()) lines.shift()
    // Remove first heading if it looks like a generic release notes title
    if (lines[0] && /^#{1,2}\s+release notes/i.test(lines[0])) {
      lines.shift()
      while (lines.length && !lines[0]?.trim()) lines.shift()
    }
    // Remove heading that redundantly includes version e.g. "# v0.2.54"
    if (lines[0] && /^#{1,2}\s*v?\d+\.\d+\.\d+/.test(lines[0])) {
      lines.shift()
      while (lines.length && !lines[0]?.trim()) lines.shift()
    }
    // Collapse multiple blank lines
    const collapsed = []
    for (const l of lines) {
      if (!l.trim() && !collapsed[collapsed.length - 1]?.trim()) continue
      collapsed.push(l)
    }
    lines = collapsed
    // Determine if first meaningful line is a heading or list implying missing summary
    if (lines[0] && /^\s*(###|##|[-*])/.test(lines[0])) {
      const firstSentence = fallback.split(/\n/)[0] // summary line from fallback
      lines.unshift(firstSentence, '')
    }
    return lines.join('\n').trim() + '\n'
  }

  let ai = null
  try {
    ai = await callAI(buildPrompt())
  } catch {
    /* swallow AI errors deliberately; fallback already prepared */
  }

  const output = ai ? sanitizeAI(ai) : fallback
  console.log(output)
}

main()
