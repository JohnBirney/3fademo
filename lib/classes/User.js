const DAO = require('./DAO')

module.exports = class User {            

    constructor(username, password, privateKey, imagefile1, imagefile2, imagefile3) {
        this.username = username
        this.password = password
        this.privateKey = privateKey
        this.imagefile1 = imagefile1
        this.imagefile2 = imagefile2
        this.imagefile3 = imagefile3
    }

    save () {
        let dao = new DAO()
        dao.createUser(this.username, this.password, this.privateKey, this.imagefile1, this.imagefile2, this.imagefile3)
    }

    static checkPassword(username, password) {
        let dao = new DAO()
        return dao.checkPassword(username, password)
    }

    static exists(username) {
        let dao = new DAO()
        return dao.userExists(username)
    }

}