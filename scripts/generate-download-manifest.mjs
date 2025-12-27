import fs from 'node:fs/promises'
import path from 'node:path'

const [distDirArg, outFileArg] = process.argv.slice(2)
const distDir = distDirArg || 'dist'
const outFile = outFileArg || 'download/manifest.json'

const ensureSlash = (value) => (value.endsWith('/') ? value : `${value}/`)

const readVersionFromYml = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, 'utf8')
    const match = content.match(/^version:\s*([^\s]+)\s*$/m)
    return match ? match[1] : null
  } catch {
    return null
  }
}

const readVersion = async () => {
  const candidates = ['latest.yml', 'latest-mac.yml', 'latest-linux.yml']
  for (const file of candidates) {
    const version = await readVersionFromYml(path.join(distDir, file))
    if (version) return version
  }

  try {
    const pkg = JSON.parse(await fs.readFile('package.json', 'utf8'))
    return pkg.version || 'unknown'
  } catch {
    return 'unknown'
  }
}

const pickFirst = (files, predicate) => files.find((file) => predicate(file))

const main = async () => {
  const version = await readVersion()
  const files = await fs.readdir(distDir)
  const entries = []

  const addEntry = (platform, label, file) => {
    if (!file) return
    entries.push({ platform, label, file })
  }

  const macDmg = pickFirst(files, (file) => file.toLowerCase().endsWith('.dmg'))
  const macZip = pickFirst(files, (file) => file.toLowerCase().endsWith('.zip'))
  addEntry('mac', macDmg ? 'macOS (DMG)' : 'macOS (ZIP)', macDmg || macZip)

  const winSetup = pickFirst(files, (file) => /-setup\.exe$/i.test(file))
  const winExe = pickFirst(files, (file) => file.toLowerCase().endsWith('.exe'))
  addEntry('win', winSetup ? 'Windows (Installer)' : 'Windows (EXE)', winSetup || winExe)

  const appImage = pickFirst(files, (file) => /\.appimage$/i.test(file))
  const deb = pickFirst(files, (file) => file.toLowerCase().endsWith('.deb'))
  const snap = pickFirst(files, (file) => file.toLowerCase().endsWith('.snap'))
  addEntry('linux', 'Linux (AppImage)', appImage)
  addEntry('linux', 'Linux (Deb)', deb)
  addEntry('linux', 'Linux (Snap)', snap)

  const bucket = process.env.GCS_BUCKET
  const baseUrl =
    process.env.DOWNLOAD_BASE_URL ||
    (bucket ? `https://storage.googleapis.com/${bucket}/updates/` : '')

  const manifest = {
    version,
    generatedAt: new Date().toISOString(),
    baseUrl: baseUrl ? ensureSlash(baseUrl) : '',
    files: entries.filter(Boolean)
  }

  await fs.mkdir(path.dirname(outFile), { recursive: true })
  await fs.writeFile(outFile, JSON.stringify(manifest, null, 2))
  process.stdout.write(`Wrote ${outFile} with ${entries.length} entries.\n`)
}

main().catch((error) => {
  process.stderr.write(`Failed to generate manifest: ${error}\n`)
  process.exit(1)
})
