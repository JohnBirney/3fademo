const bcrypt = require('bcrypt')
//const speakeasy = require('speakeasy')

module.exports = class Encryption {

    static createHash(plainText) {
        return bcrypt.hashSync(plainText, 10)
    }

    static compareHash(plainText, hash) {
        return bcrypt.compareSync(plainText, hash)
    }

    /*static verifyAuthToken(privateKey, authToken) {
        let verified = speakeasy.totp.verify({ secret: privateKey,
            encoding: 'base32',
            token: authToken })
        return verified
    }*/

}