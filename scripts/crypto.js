require('dotenv').config()
const crypto = require('crypto');
const { generateAccessToken, generateRefreshToken } = require('../utils/token')

// // Clave secreta compartida (debe ser generada y almacenada de forma segura)
// const secretKey = '12345678abcdefgh';

// // Access token a encriptar
// const accessToken = 'mi_access_token';

// // Vector de inicialización (IV) aleatorio
// const iv = crypto.randomBytes(16);
// console.log(iv.length)

// // Crear un objeto de cifrado con el algoritmo AES-256-CBC, la clave secreta y el IV
// const cipher = crypto.createCipheriv('aes-128-cbc', secretKey, iv);

// // Encriptar el access token utilizando el objeto de cifrado
// let encrypted = cipher.update(accessToken, 'utf8', 'hex');
// encrypted += cipher.final('hex');

// let token = `${encrypted}:${iv.toString('hex')}`
// console.log(token)

// // Imprimir el access token encriptado y el vector de inicialización (IV)
// console.log('Access token encriptado:', encrypted);
// console.log('Vector de inicialización (IV):', iv.toString('hex'));

// // Crear un objeto de descifrado con el algoritmo AES-256-CBC, la clave secreta y el IV
// const decipher = crypto.createDecipheriv('aes-128-cbc', secretKey, iv);

// // Descifrar el access token utilizando el objeto de descifrado
// let decrypted = decipher.update(encrypted, 'hex', 'utf8');
// decrypted += decipher.final('utf8');

// // Imprimir el access token descifrado
// console.log('Access token descifrado:', decrypted);

function generateCryptoToken(refresh_token) {
  // Clave secreta compartida (debe ser generada y almacenada de forma segura)
  const SECRET_KEY = process.env.CRYPTO_SECRET
  // Vector de inicialización (IV) aleatorio
  const iv = crypto.randomBytes(16);
  console.log(iv.length)

  const cipher = crypto.createCipheriv('aes-128-cbc', SECRET_KEY, iv);
  // Encriptar el access token utilizando el objeto de cifrado
  let encrypted = cipher.update(refresh_token, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return encrypted + ':' + iv.toString('hex'); 
}

function decodeCryptoToken(token) {
  const [ _token, iv ] = token.split(':')
  const SECRET_KEY = process.env.CRYPTO_SECRET

    // Crear un objeto de descifrado con el algoritmo AES-256-CBC, la clave secreta y el IV
  const decipher = crypto.createDecipheriv('aes-128-cbc', SECRET_KEY, Buffer.from(iv, 'hex'));

  // Descifrar el access token utilizando el objeto de descifrado
  let decrypted = decipher.update(_token, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  // Imprimir el access token descifrado
  console.log('Access token descifrado:', decrypted);
}

;(async () => {
  console.time()
  const jwt = await generateAccessToken({
    email: 'miguel@gmail.com',
    name: 'Miguel',
    userId: '123144354535435535',
    username: 'miguel2351',
    restrictedSession: false
  })
  const jwt2 = await generateRefreshToken({
    sessionId: 'asfasdsfsafdfasdf'
  })
  const token = generateCryptoToken('ya29.a0Ael9sCOMa6PxyFGE7BVDxmr7luEyb73IrEbsM64A9fPUN8JWbP6DR9LqzIt5Xh2tNhsnYOcC1iBvHzU1Th1CpCdlK3RJ70ts5G0dLpB7Hgo2Bbv3m6vl1IKGZvYsVjK3lJUC0h7hWPVGsGdhZT5gDJEaPWwSeUK3aCgYKAbwSARISFQF4udJhM25P1v1I8Il4VdYpOepg2g0167')
  console.log('Toke ' + token + ' end')
  decodeCryptoToken(token)
  console.log(jwt)
  console.log(jwt2)
  fetch('https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=ya29.a0Ael9sCOMa6PxyFGE7BVDxmr7luEyb73IrEbsM64A9fPUN8JWbP6DR9LqzIt5Xh2tNhsnYOcC1iBvHzU1Th1CpCdlK3RJ70ts5G0dLpB7Hgo2Bbv3m6vl1IKGZvYsVjK3lJUC0h7hWPVGsGdhZT5gDJEaPWwSeUK3aCgYKAbwSARISFQF4udJhM25P1v1I8Il4VdYpOepg2g0167')
  .then(data => data.json()).then(token => console.log(token))
  console.timeEnd()
})()

// const crypto = require('crypto');

// // Clave secreta compartida (debe ser generada y almacenada de forma segura)
// const secretKey = 'mi_clave_secreta';

// // Access token a encriptar
// const accessToken = 'mi_access_token';

// // Crear un objeto de cifrado con el algoritmo AES y la clave secreta
// const cipher = crypto.createCipher('aes-256-cbc', secretKey);

// // Encriptar el access token utilizando el objeto de cifrado
// let encrypted = cipher.update(accessToken, 'utf8', 'hex');
// encrypted += cipher.final('hex');

// // Imprimir el access token encriptado
// console.log(encrypted);

// const crypto = require('crypto');
// const algorithm = 'aes-256-ctr';
// const ENCRYPTION_KEY = '4ac4e678621a28798b04bccf8b372357'; // or generate sample key Buffer.from('FoCKvdLslUuB4y3EZlKate7XGottHski1LmyqJHvUhs=', 'base64');
// const IV_LENGTH = 16;

// function encrypt(text) {
//     let iv = crypto.randomBytes(IV_LENGTH);
//     let cipher = crypto.createCipheriv('aes-256-ocb', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
//     let encrypted = cipher.update(text);
//     encrypted = Buffer.concat([encrypted, cipher.final(), Buffer.alloc(32)], 32);
//     return iv.toString('hex') + ':' + encrypted.toString('hex');
// }

// function decrypt(text) {
//     let textParts = text.split(':');
//     let iv = Buffer.from(textParts.shift(), 'hex');
//     let encryptedText = Buffer.from(textParts.join(':'), 'hex');
//     let decipher = crypto.createDecipheriv('aes-256-ocb', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
//     let decrypted = decipher.update(encryptedText);
//     decrypted = Buffer.concat([decrypted, decipher.final(), Buffer.alloc(32)], 32);
//     return decrypted.toString();
// }

// const hw = encrypt("hello world")
// console.log(hw)
// console.log(decrypt(hw))