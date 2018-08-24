# Talent token smartcontracts

## Getting started
make sure npm and nodejs are installed, then run:
```bash
npm install
```

## Development
This codebase uses a TDD approach, so write the tests, then write the implementation.
To run the tests: 
```bash
npm run test
```

## Deployment
this will run the migrations on the testnet  
Don't forget to change the parameters in Settings.js before deployment. 
```
geth --rpcapi web3,eth,personal,miner,net,txpool --testnet --rpc --syncmode "fast" cache 1024 --unlock 0x9ab9D29c7577756FFCdc7656882b5cbFa584e628 --password xxxxxx
```