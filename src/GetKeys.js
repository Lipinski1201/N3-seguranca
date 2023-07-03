const fs = require('fs');
const readline = require('readline-sync');
const BigInteger = require('big-integer');

function getPrivateExp(Phi, E) {
  const big0 = BigInteger('0');
  const big1 = BigInteger('1');

  let r1 = E;
  let D = BigInteger('1');
  let quotrem = Phi.divmod(E);
  let quot = quotrem.quotient;
  let r2 = quotrem.remainder;
  let x = Phi.minus(quot);

  while (r2.compare(big0) !== 0) {
    quotrem = r1.divmod(r2);
    quot = quotrem.quotient;
    const rem = quotrem.remainder;
    r1 = r2;
    r2 = rem;
    const temp = x;
    x = Phi.add(D).minus(quot.multiply(x).mod(Phi)).mod(Phi);
    D = temp;
  }

  return {
    D,
    goodkey: r1.compare(big1) === 0,
  };
}

function saveKeyToFile(filename, module, key) {
  const data = `${module}\n${key}\n`;
  fs.writeFileSync(filename, data, 'utf8');
}

function main() {
  console.log();
  console.log('GetKeys');
  console.log();
  console.log('Please enter two distinct prime numbers');
  console.log('Note: there is no check whether these numbers');
  console.log('are distinct primes. Encryption/decryption');
  console.log('won\'t work unless they are.');
  console.log();

  const pstr = readline.question('first prime: ');
  const qstr = readline.question('second prime: ');

  const P = BigInteger(pstr);
  const Q = BigInteger(qstr);

  let D = null;
  let E = null;
  let goodkey = false;
  let estr = 100;

  while (!goodkey) {
    console.log();
    E = BigInteger(estr.toString());
    const { D: privateExp, goodkey: isGoodKey } = getPrivateExp(
      P.minus(BigInteger('1')).multiply(Q.minus(BigInteger('1'))),
      E
    );
    D = privateExp;
    goodkey = isGoodKey;
    if (!goodkey) {
      const publicKeyFile = 'publicKey.txt';
      const privateKeyFile = 'privateKey.txt';
      saveKeyToFile(publicKeyFile, P.toString(), E.toString());
      saveKeyToFile(privateKeyFile, P.toString(), D.toString());
      estr++;
    }
  }

  console.log();
  console.log('The modulus, public and private key are as follows.');
  console.log('Modulus    : ' + P.multiply(Q));
  console.log('Private Exp: ' + D);
  console.log('Public Exp : ' + E);
}

main();
