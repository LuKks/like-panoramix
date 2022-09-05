# panoramix

EVM decompiler

```
pip install panoramix-decompiler
npm i LuKks/panoramix
```

Depends on [palkeo/panoramix](https://github.com/palkeo/panoramix).

## Usage
```javascript
const panoramix = require('panoramix')
const provider = 'https://bsc-dataseed.binance.org'

const busd = await panoramix({ provider, contractAddress: '0xe9e7cea3dedca5984780bafc599bd69add087d56' })
console.log('busd', busd.stdout)
```

## License
MIT
