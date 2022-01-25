const { spawn } = require('child_process')
const stripAnsi = require('strip-ansi')

// + WIP

module.exports = panoramix

function panoramix ({ provider, contractAddress }) {
  return new Promise((resolve, reject) => {
    let stdout = ''
    let stderr = ''

    const proc = spawn('panoramix', [contractAddress], {
      env: {
        ...process.env,
        WEB3_PROVIDER_URI: provider
      }
    })

    proc.stdout.on('data', (data) => {
      stdout += data.toString()
    })

    proc.stderr.on('data', (data) => {
      stderr += data
    })

    proc.once('close', () => {
      stdout = stripAnsi(stdout)
      stderr = stripAnsi(stderr)

      if (stdout.includes('# No code found for this contract.')) {
        resolve({ stdout: null, stderr })
        return
      }

      // if starts with *
      stdout = stdout.replace('# Palkeoramix decompiler. \n\n', '')

      resolve({ stdout, stderr })
    })

    proc.once('error', (error) => {
      reject(error)
    })
  })
}
