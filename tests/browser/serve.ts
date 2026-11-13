/**
 * A static server for a built playground, for the browser tests: `node serve.ts <dir> <port>`.
 * The gallery is generated as static files, and this serves them as a host would, offline.
 */
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, join, normalize, resolve, sep } from 'node:path'

const [root = '.', port = '4310'] = process.argv.slice(2)
const base = resolve(root)

const types: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
}

async function fileFor(url = '/'): Promise<string | undefined> {
  const path = decodeURIComponent(new URL(url, 'http://localhost').pathname)
  const file = normalize(join(base, path))
  if (file !== base && !file.startsWith(base + sep)) return undefined
  try {
    const info = await stat(file)
    if (!info.isDirectory()) return file
    await stat(join(file, 'index.html'))
    return join(file, 'index.html')
  } catch {
    return undefined
  }
}

createServer(async (request, response) => {
  const file = await fileFor(request.url)
  if (!file) {
    response.writeHead(404).end()
    return
  }
  response.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' })
  createReadStream(file).pipe(response)
}).listen(Number(port), '127.0.0.1')
