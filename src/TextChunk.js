const BigInteger = require('big-integer');

class TextChunk {
  constructor(s) {
    this.stringVal = s;
  }

  toString() {
    return this.stringVal;
  }

  constructor(n) {
    const big256 = BigInteger('256');
    const big0 = BigInteger.ZERO;

    if (n.compare(big0) === 0) {
      this.stringVal = '0';
    } else {
      this.stringVal = '';
      while (n.compare(big0) > 0) {
        const [quotient, remainder] = n.divmod(big256);
        const charNum = remainder.valueOf();
        this.stringVal += String.fromCharCode(charNum);
        n = quotient;
      }
    }
  }

  bigIntValue() {
    const big256 = BigInteger('256');
    let result = BigInteger('0');

    for (let i = this.stringVal.length - 1; i >= 0; i--) {
      result = result.multiply(big256);
      result = result.add(BigInteger.valueOf(this.stringVal.charCodeAt(i)));
    }

    return result;
  }

  static blockSize(n) {
    const big1 = BigInteger.ONE;
    const big2 = BigInteger.TWO;

    let blockSize = 0;
    let temp = n.minus(big1);

    while (temp.compare(big1) > 0) {
      temp = temp.divide(big2);
      blockSize++;
    }

    return Math.floor(blockSize / 8);
  }

  static splitChunk(textFile, blockSize) {
    const textFileLength = textFile.length;
    const stringList = [];

    for (let indexFrom = 0; indexFrom < textFileLength; indexFrom += blockSize) {
      let indexToStop = indexFrom + blockSize;

      if (indexToStop > textFileLength) {
        indexToStop = textFileLength;
      }

      stringList.push(textFile.substring(indexFrom, indexToStop));
    }

    return stringList;
  }
}

// Test program
const test = "asdfasdf232435@#%@";
const chunk1 = new TextChunk(test);
const n = chunk1.bigIntValue();
console.log("biginteger value of " + test + " = " + n);
console.log("blocksize for that is " + TextChunk.blockSize(n));
const chunk2 = new TextChunk(n);
const s = chunk2.toString();
console.log("converted back to string = " + s);
if (s === test) {
  console.log("success");
} else {
  console.log("FAIL");
}
