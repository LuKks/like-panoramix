# like-panoramix

EVM decompiler wrapper for Node.js

```
pip install panoramix-decompiler
npm i like-panoramix
```

Depends on [palkeo/panoramix](https://github.com/palkeo/panoramix)

## Usage

```js
const Panoramix = require('like-panoramix')

const panoramix = new Panoramix({
  provider: 'https://bsc-dataseed.binance.org'
})

const output = await panoramix.run('0x55d398326f99059fF775485246999027B3197955')
console.log('USDT', output) /* =>
def storage:
  owner is addr at storage 0
  balanceOf is mapping of uint256 at storage 1
  ...

def name() payable: 
  return _name[0 len _name.length]

def totalSupply() payable: 
  return totalSupply

...
*/

const output2 = await panoramix.run('0x0000000000000000000000000000000000000000')
console.log('Zero address', output2) // => null
```

## API

#### `const panoramix = new Panoramix(options)`

Creates a new instance for decompiling contracts.

Available `options`:

```js
{
  provider // RPC provider
}
```

#### `panoramix.workers`

Map that contains active workers.

#### `const sourcecode = await panoramix.run(contractAddress)`

Spawns a worker that decompiles the contract.

Returns `null` if not found.

#### `await panoramix.close()`

Signals to all workers to close, and waits for them.

## License

MIT
