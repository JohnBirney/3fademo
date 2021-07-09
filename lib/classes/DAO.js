const sqlite = require('sqlite-sync')
const Encryption = require('./Encryption')
const DB_PATH = './data/3FADemo.db'

module.exports = class DAO {

    constructor() {
        sqlite.connect(DB_PATH)
    }

    createUser(username, password, privateKey, imagefile1, imagefile2, imagefile3) {
        let hash = Encryption.createHash(password)
        let sql = `INSERT INTO user (username, password, privatekey, imagefile1, imagefile2, imagefile3) VALUES ('${username}', '${hash}', '${privateKey}', '${imagefile1}', '${imagefile2}', '${imagefile3}')`
        sqlite.run(sql)
    }

    checkUsername(username) {
        let result = sqlite.run(`SELECT COUNT(*) FROM user WHERE username='${username}'`)
        return result[0]['COUNT(*)'] > 0
    }

    userExists(username) {
        let result = sqlite.run(`SELECT COUNT(*) FROM user WHERE username='${username}'`)
        return result[0]['COUNT(*)'] > 0
    }    

    checkPassword(username, password) {
        let result = sqlite.run(`SELECT password FROM user WHERE username='${username}'`)
        if (result.length > 0) {
            let hash = result[0]['password']
            return Encryption.compareHash(password, hash)    
        }
    }

    checkAuthToken(username, authToken) {
        let result = sqlite.run(`SELECT privatekey FROM user WHERE username='${username}'`)
        if (result.length > 0) {
            let privateKey = result[0]['privatekey']
            return Encryption.verifyAuthToken(privateKey, authToken)    
        }
    }

    getPrivateKey(username) {
        let result = sqlite.run(`SELECT privatekey FROM user WHERE username='${username}'`)
        if (result.length > 0) {
            return result[0]['privatekey']
        }        
    }

    getTable(table) {
        let result = sqlite.run(`SELECT * FROM ${table}`)
        return result
    }

    close() {
        sqlite.close()
    }

}