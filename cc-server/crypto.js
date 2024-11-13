const EC = require('elliptic').ec;
// Use elliptic curve 'secp256k1' for key generation (Bitcoin's curve)
const ec = new EC('secp256k1');

function verifySignature(signature, message, publicKey) {
    const key = ec.keyFromPublic(publicKey, 'hex');
    return (key.verify(message, signature));
}


module.exports = {
    verifySignature,

}