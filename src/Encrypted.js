const fs = require('fs');
const BigInteger = require('big-integer');
const { Buffer } = require('buffer');

class TextChunk {
  constructor(chunk) {
    this.chunk = chunk;
  }

  bigIntValue() {
    return BigInteger(this.chunk);
  }

  static blockSize(n) {
    return Math.floor((n.bitLength() + 7) / 8);
  }

  static splitChunk(text, chunkSize) {
    const chunks = [];
    let index = 0;
    while (index < text.length) {
      const chunk = text.substr(index, chunkSize);
      chunks.push(chunk);
      index += chunkSize;
    }
    return chunks;
  }
}

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
  const e = BigInteger(keyData[1]);

  const plaintext = fs.readFileSync(inputFile, 'utf8');

  const plaintextBytes = Buffer.from(plaintext, 'utf8');
  const base64Text = Buffer.from(plaintextBytes).toString('base64');

  const encodedChunks = TextChunk.splitChunk(base64Text, TextChunk.blockSize(n));
  let encodedChunksBuilder = '';
  for (let i = 0; i < encodedChunks.length; i++) {
    const chunk = encodedChunks[i];
    const encodedChunk = new TextChunk(chunk).bigIntValue().modPow(e, n);
    encodedChunksBuilder += encodedChunk.toString() + '\n';
  }

  fs.writeFileSync(outputFile, encodedChunksBuilder, 'utf8');
}

const args = process.argv.slice(2);
main(args);
