const Authentication = require('./classes/Authentication')
//const PasswordValidator = require('password-validator')
const fs = require('fs')
const path = require('path')
const TempFileChar = '~'

exports.initSession = (req) => {

    req.session.maxChevron = 0
    req.session.username = ''
    req.session.password = ''
    req.session.repassword = ''
    req.session.gaCode = ''
    req.session.privateKey = ''
    req.session.qrcodeData = ''
    req.session.filename1 = ''
    req.session.filename2 = ''
    req.session.filename3 = ''
    /*req.session.base64Str1 = ''
    req.session.base64Str2 = ''
    req.session.base64Str3 = ''*/
    req.session.blacklist = Authentication.blacklist()
    req.session.save()

    this.deleteTempImages()
}

exports.deleteTempImages = () => {
    // remove all temporary image files from uploads dir
    const fullDirPath = path.join(__dirname, '../data/uploads')
    if (fs.existsSync(fullDirPath)) {
        const files = fs.readdirSync(fullDirPath)
        files.forEach(file => {
            if (file.charAt(0) == TempFileChar) {
                fs.unlinkSync(path.join(fullDirPath, file))
            }
        })
    }
}

exports.validatePassword = (req, testPassword) => {

    const blacklist = req.session.blacklist.map((p) => {return p.password})
    return Authentication.verifyPassword(blacklist, testPassword)

/*    let schema = new PasswordValidator()
    const data = req.session.blacklist
    const blacklist = data.map((p) => {return p.password})

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
    return result    */

}