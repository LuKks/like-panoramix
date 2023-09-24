const test = require('brittle')
const Panoramix = require('./index.js')

const PROVIDER = 'https://bsc-dataseed.binance.org'

test('basic', async function (t) {
  t.plan(1)

  const panoramix = new Panoramix({ provider: PROVIDER })

  const busd = await panoramix.run('0x55d398326f99059fF775485246999027B3197955')
  t.ok(busd.includes('def name() payable:'))

  await panoramix.close()
})

test('not found', async function (t) {
  t.plan(1)

  const panoramix = new Panoramix({ provider: PROVIDER })

  const zero = await panoramix.run('0x0000000000000000000000000000000000000000')
  t.is(zero, null)

  await panoramix.close()
})

test('close', async function (t) {
  t.plan(2)

  const panoramix = new Panoramix({ provider: PROVIDER })
  const running = panoramix.run('0x55d398326f99059fF775485246999027B3197955')
  const closing = panoramix.close()

  try {
    await running
  } catch (err) {
    t.is(err.message, 'Worker closed')
  }

  await closing

  try {
    await panoramix.run('0x55d398326f99059fF775485246999027B3197955')
  } catch (err) {
    t.is(err.message, 'Panoramix is closed')
  }
})
