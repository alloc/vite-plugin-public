import type { Plugin } from 'vite'
import { crawl } from 'recrawl-sync'
import crypto from 'crypto'
import slash from 'slash'
import path from 'path'
import fs from 'fs'

export const publicHash = ({
  ignore,
  skipRename,
}: { ignore?: RegExp; skipRename?: boolean } = {}): Plugin => {
  const builtMap = new Map<string, string>()
  const builtUrls = new Set<string>()

  return {
    name: 'vite-public:hash',
    apply: 'build',
    enforce: 'pre',
    resolveId: id => builtMap.get(id),
    load(id) {
      if (builtUrls.has(id)) {
        id = id.slice(1)
        return `export default ${JSON.stringify(id)}`
      }
    },
    configResolved({ root, build: { base, outDir } }) {
      outDir = path.posix.resolve(root, outDir)

      const publicDir = path.posix.join(root, 'public')
      const files = crawl(publicDir, {
        filter: ignore && (file => !ignore.test(file)),
        skip: ['.DS_Store'],
      }).map(slash)

      const renamed: { [file: string]: string } = {}
      for (const file of files) {
        const srcPath = path.posix.join(publicDir, file)
        const ext = path.extname(file)

        // Inject the content hash.
        const hash = toContentHash(fs.readFileSync(srcPath))
        const hashedFile = file.slice(0, -ext.length) + '.' + hash + ext
        if (!skipRename) {
          renamed[file] = path.posix.join(outDir, hashedFile)
        }

        const builtUrl = '!' + base + hashedFile
        builtMap.set('/' + file, builtUrl)
        builtUrls.add(builtUrl)
      }

      if (!skipRename)
        this.generateBundle = function () {
          for (const file of files) {
            fs.renameSync(path.posix.join(outDir, file), renamed[file])
          }
        }
    },
  }
}

function toContentHash(content: Buffer) {
  return crypto.createHash('md5').update(content).digest('hex').slice(0, 8)
}
