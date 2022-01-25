const panoramix = require('./index.js')

main()

async function main () {
  const provider = 'https://bsc-dataseed.binance.org'

  const busd = await panoramix({ provider, contractAddress: '0xe9e7cea3dedca5984780bafc599bd69add087d56' })
  console.log('busd', busd.stdout)
}
