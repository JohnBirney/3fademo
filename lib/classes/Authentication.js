const DAO = require('./DAO')
//const Encryption = require('./Encryption')
const speakeasy = require('speakeasy')

module.exports = class Authentication {

    constructor() {
        this.dao = new DAO()
    }

    doChecks(req) {
        let errors = []
        let usernameCheck = this.checkUsername(req.body.username) || errors.push('invalid username')
        let passwordCheck = this.checkPassword(req.body.username, req.body.password) || errors.push('invalid password')
        let authTokenCheck = this.checkAuthToken(req.body.username, req.body.authToken) || errors.push('invalid authentication token')
        return {value: usernameCheck && passwordCheck && authTokenCheck, messages: errors}
    }

    checkUsername(username) {
        return this.dao.checkUsername(username)
    }

    checkPassword(username, password) {
        return this.dao.checkPassword(username, password)
    }

    static verifyAuthToken(privateKey, authToken) {
        let verified = speakeasy.totp.verify({ secret: privateKey,
            encoding: 'base32',
            token: authToken })
        return verified
    }

    static checkAuthToken(username, authToken) {
        let dao = new DAO()
        let privateKey = dao.getPrivateKey(username)
        let result = false
        if (privateKey !== '') {
            result = Authentication.verifyAuthToken(privateKey, authToken)
        }
        return result
        //return dao.checkAuthToken(username, authToken)
    }    

    static blacklist() {
        let dao = new DAO()
        let result = dao.getTable('blacklist')
        dao.close()
        return result
    }

}