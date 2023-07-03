const fs = require('fs');
const BigInteger = require('big-integer');
const { Buffer } = require('buffer');

function main(args) {
  if (args.length !== 3) {
    console.log('Modo de uso: <key_file> <input_file> <output_file>');
    return;
  }

  const keyFile = args[0];
  const inputFile = args[1];
  const outputFile = args[2];

  const keyData = fs.readFileSync(keyFile, 'utf8').split('\n');
  const n = BigInteger(keyData[0]);
  const d = BigInteger(keyData[1]);

  const inputData = fs.readFileSync(inputFile, 'utf8').split('\n');

  let decryptedData = '';
  for (let i = 0; i < inputData.length; i++) {
    const encodedChunk = inputData[i];
    const chunk = BigInteger(encodedChunk).modPow(d, n);
    const chunkBytes = chunk.toArray(256).value;
    const paddedBytes = chunkBytes.slice(1);
    decryptedData += Buffer.from(paddedBytes).toString('utf8');
  }

  const plaintextBytes = Buffer.from(decryptedData, 'base64');
  const decodedText = plaintextBytes.toString('utf8');

  fs.writeFileSync(outputFile, decodedText, 'utf8');
}

const args = process.argv.slice(2);
main(args);
