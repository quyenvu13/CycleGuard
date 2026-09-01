import http from 'node:http'
import { createReadStream, existsSync, statSync } from 'node:fs'
import { extname, join, normalize, resolve } from 'node:path'

const root = resolve(new URL('..', import.meta.url).pathname)
const port = Number(process.env.PORT || 5173)
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.json':'application/json; charset=utf-8', '.png':'image/png' }

http.createServer((req, res) => {
  const raw = decodeURIComponent((req.url || '/').split('?')[0])
  const requested = raw === '/' ? '/index.html' : raw
  const publicPath = join(root, 'public', normalize(requested).replace(/^[/\\]+/, ''))
  const rootPath = join(root, normalize(requested).replace(/^[/\\]+/, ''))
  let path = existsSync(publicPath) && statSync(publicPath).isFile() ? publicPath : rootPath
  if (!existsSync(path) || !statSync(path).isFile()) path = join(root, 'index.html')
  res.writeHead(200, { 'content-type': types[extname(path)] || 'application/octet-stream', 'cache-control':'no-store' })
  createReadStream(path).pipe(res)
}).listen(port, '0.0.0.0', () => console.log(`CycleGuard dev server: http://localhost:${port}`))
