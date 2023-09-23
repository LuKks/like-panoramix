const { spawn } = require('child_process')
const ansi = require('ansi-match')

module.exports = class Panoramix {
  constructor (opts = {}) {
    if (!opts.provider) throw new Error('Provider option is required')

    this.provider = opts.provider
    this.workers = new Set()

    this._closing = false
  }

  run (contractAddress) {
    return new Promise((resolve, reject) => {
      if (this._closing) {
        reject(new Error('Panoramix is closed'))
        return
      }

      let stdout = ''
      let stderr = '' // Not using it for now

      const worker = spawn('panoramix', [contractAddress], {
        env: {
          ...process.env,
          WEB3_PROVIDER_URI: this.provider
        }
      })

      this.workers.add(worker)

      worker.stdout.on('data', (data) => {
        stdout += data.toString()
      })

      worker.stderr.on('data', (data) => {
        stderr += data.toString()
      })

      worker.once('close', () => {
        this.workers.delete(worker)

        if (worker.killed) {
          reject(new Error('Worker closed'))
          return
        }

        stdout = stdout.replace(ansi, '')
        stderr = stderr.replace(ansi, '')

        if (stdout.includes('# No code found for this contract.')) {
          resolve(null)
          return
        }

        stdout = stdout.replace('# Palkeoramix decompiler. \n\n', '')
        stdout = stdout.trim()

        resolve(stdout)
      })

      worker.once('error', (error) => {
        this.workers.delete(worker)

        reject(error)
      })
    })
  }

  async close () {
    if (this._closing) return
    this._closing = true

    const closing = []

    for (const worker of this.workers) {
      this.workers.delete(worker)

      worker.kill('SIGINT')

      if (worker.exitCode === null) {
        closing.push(new Promise(resolve => worker.once('close', resolve)))
      }
    }

    await Promise.all(closing)
  }
}
