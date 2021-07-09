const bcrypt = require('bcryptjs')

module.exports = class Encryption {

    static createHash(plainText) {
        return bcrypt.hashSync(plainText, 10)
    }

    static compareHash(plainText, hash) {
        return bcrypt.compareSync(plainText, hash)
    }

}