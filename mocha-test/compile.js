const fs = require('fs');
const { promisify } = require('util');

const _ = require('lodash');
const should = require('should');

const solc = require('solc');

// Useful when async func goes wrong
process.on('unhandledRejection', (r) => {
  console.log('UnhandledRejection');
  console.error(r);
});

describe('Contracts', async () => {
  const contracts = [
    'ERC20Interface.sol',
    'Forwarder.sol',
    'WalletSimple.sol',
    'coins/EtcWalletSimple.sol',
    'coins/RskWalletSimple.sol',
    'coins/CeloWalletSimple.sol',
    'coins/XdaiWalletSimple.sol',
    'WalletFactory.sol',
    'ForwarderFactory.sol',
    'CloneFactory.sol'
  ];

  let result;

  before(async function () {
    // solc takes a while
    this.timeout(10000);
    const contents = await Promise.all(
      contracts.map(async (filename) =>
        (await promisify(fs.readFile)('./contracts/' + filename)).toString()
      )
    );

    sources = {};
    for (let i = 0; i < contracts.length; i++) {
      const contract = contracts[i];
      const content = contents[i];
      sources[contract] = content;
    }

    const input = {
      language: 'Solidity',
      sources: {
        'test.sol': {
          content: 'contract C { function f() public { } }'
        }
      },
      settings: {
        outputSelection: {
          '*': {
            '*': ['*']
          }
        }
      }
    };

    result = solc.compile(JSON.stringify(input));
  });

  it('compile without warnings and errors', () => {
    should.equal(
      (result.errors || []).length,
      0,
      (result.errors || []).join('\n')
    );
  });
});
