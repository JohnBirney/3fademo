const DAO = require('./DAO')
const PasswordValidator = require('password-validator')
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

    static verifyPassword(blacklist, testPassword) {

        let schema = new PasswordValidator()
        //const data = blacklist//req.session.blacklist
        //const blacklist = data.map((p) => {return p.password})
    
        schema
            .has().lowercase(1)
    //        .is().not().oneOf()
    //        .is().min(4)
    //        .is().max(16)
    //        .has().uppercase()
    //        .has().digits(1)
    //        .has().not().spaces()
            .is().not().oneOf(blacklist)
    
        let result = schema.validate(testPassword, {list: true})
        return result            
    }    

}