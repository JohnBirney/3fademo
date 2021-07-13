const speakeasy = require('speakeasy')
const User = require('./classes/User')
const Authentication = require('./classes/Authentication')
const fs = require('fs')
const utils = require('./utils')
const Encryption = require('./classes/Encryption')
const path = require('path')
const TempFileChar = '~'

exports.unamepwd = (req, res) => {

    const errors = []

    //let validatePassword = utils.validatePassword(req.body.password)
    let validatePassword = utils.validatePassword(req, req.body.password)

    if (req.body.username == '') {
        errors.push(`usename required`)
    } else if (req.body.password == '') {
        errors.push(`password required`)
    } else if (req.body.repassword == '') {
        errors.push(`password needs to be re-entered`)
    } else {
        if (User.exists(req.body.username)) {
            errors.push(`user already exists`)
        }
        if (validatePassword.length) {
            if (validatePassword.includes('oneOf')) {
                errors.push(`includes <a href='/disallowedPasswords'>disallowed passwords</a>`)
            } else {
                errors.push(`fails <a href='/passwordRules'>password rules</a>`)
            }
        }
        if (req.body.password !== req.body.repassword) {
            errors.push(`passwords don't match`)
        }
    }

    req.session.username = req.body.username
    req.session.password = req.body.password
    req.session.repassword = req.body.repassword
    req.session.save()

    if (errors.length > 0) {
        req.session.flash = {
            type: 'danger',
            intro: 'Error',
            message: errors.join(', ')
        }        
        res.redirect(303, '/unamepwd')
    } else {
        res.redirect(303, '/ga')
    }

}

/*exports.privateKey = (req, res) => {
    let secret = speakeasy.generateSecret()
    let secretBase32 = secret.base32
    let result = {
        otpauthURL: speakeasy.otpauthURL({ secret: secret.ascii, label: '3FADemo', algorithm: 'sha512' }),
        base32: secretBase32
    }  
    req.session.privateKey = result.base32
    req.session.qrcodeData = result.otpauthURL
    req.session.save()
    res.send(result)
}*/

exports.gaSession = (req, res) => {
    req.session.privateKey = req.body.privateKey
    req.session.qrcodeData = req.body.qrcodeData
    req.session.save()
}

exports.ga = (req, res) => { 
    res.redirect(303, '/faceimage')    
}

exports.faceimageSession = (req, res) => {

    if (req.body.filename1 !== '') {
        /*req.session.filename1 = req.body.filename1
        req.session.filename2 = req.body.filename2
        req.session.filename3 = req.body.filename3
        req.session.save()*/

        /*const base64Strs = [req.body.base64Str1, req.body.base64Str2, req.body.base64Str3]
        const imagefiles = [req.body.filename1, req.body.filename2, req.body.filename3]
        let basePath = path.join(__dirname, '..', 'data', 'uploads')
        fs.chmod(basePath, 0o777, () => {
            for (let i = 0; i < imagefiles.length; i++) {
                let base64Image = base64Strs[i].split(';base64,').pop()
                let filepath = path.join(basePath, imagefiles[i])
                
                fs.writeFile(filepath, base64Image, {encoding: 'base64'}, function(err) {
                    if (err) {}
                })
                fs.writeFile(filepath.slice(0,-4) + '.txt', 'xyz', {}, function(err2) {})
            }
        })*/    
    }

}

exports.saveFile = (req, res) => {
    let filename = req.body.filename
    let base64 = req.body.base64
    return new Promise((resolve, reject) => {
        //if (!fs.existsSync('data')) {
        //    fs.mkdirSync('data')
        //}
        fs.writeFileSync(`data/uploads/${filename}`, base64, {encoding: 'base64'}, (err) => {
            if (err) {
                reject(err)
            } else {
                resolve(base64)
            }
        })
    })
}

exports.faceimage = (req, res) => {

    const errors = []

    if (req.body.filename1 !== '') {
        req.session.filename1 = req.body.filename1
        req.session.filename2 = req.body.filename2
        req.session.filename3 = req.body.filename3
        //req.session.base64Str1 = req.body.base64Str1
        //req.session.base64Str2 = req.body.base64Str2
        //req.session.base64Str3 = req.body.base64Str3
        //req.session.save()

        /*const base64Strs = [req.body.base64Str1, req.body.base64Str2, req.body.base64Str3]
        const imagefiles = [req.body.filename1, req.body.filename2, req.body.filename3]
        for (let i = 0; i < base64Strs.length; i++) {
            let base64Image = base64Strs[i].split(';base64,').pop()
            fs.writeFile('./data/uploads/' + imagefiles[i], base64Image, {encoding: 'base64'}, function(err) {})            
        }*/
    } else {
        errors.push(`Three images are required.`)
    }

    if (errors.length > 0) {
        req.session.flash = {
            type: 'danger',
            intro: 'Error',
            message: errors.join(', ')
        }        
        res.redirect(303, '/faceimage')
    } else {
        res.redirect(303, '/createuser')
    }
}

exports.createUser = (req, res) => {

    const username = req.body.username

    if (!User.exists(username)) {
        const filename1 = req.session.filename1.substring(1)
        const filename2 = req.session.filename2.substring(1)
        const filename3 = req.session.filename3.substring(1)
        let user = new User(username, req.body.password, req.body.privateKey, filename1, filename2, filename3)
        user.save()
        req.session.filename1 = filename1
        req.session.filename2 = filename2
        req.session.filename3 = filename3
        req.session.save()
        for (let i = 1; i <= 3; i++) {
            let tempName = `./data/uploads/${TempFileChar}${username}${i}.png`
            let newName = `./data/uploads/${username}${i}.png`
            fs.rename(tempName, newName, () => {})
        }
        req.session.flash = {
            type: 'success',
            intro: 'Success',
            message: 'user created'
        }
    } else {
        req.session.flash = {
            type: 'danger',
            intro: 'Error',
            message: 'user already exists'
        }                
    }
    res.redirect(303, '/createuser')

}

exports.authunamepwd = (req, res) => {

    let errors = []
    let exists = User.exists(req.body.username)
    if (exists) {
        let badPassword = !User.checkPassword(req.body.username, req.body.password)
        if (badPassword) {
            errors.push(`invalid password`)
        }
    } else {
        errors.push(`user doesn't exist`)
    }

    req.session.username = req.body.username
    req.session.password = req.body.password
    req.session.save()

    if (errors.length > 0) {
        req.session.flash = {
            type: 'danger',
            intro: 'Error',
            message: errors.join(', ')
        }         
        res.redirect(303, '/authunamepwd')
    } else {
        res.redirect(303, '/authga')        
    }

}

exports.authga = (req, res) => {

    let errors = []

    if(req.body.gaCode == '') {
        errors.push(`Google Authenticator 6-digit code is required`)
    } else if (!Authentication.checkAuthToken(req.session.username, req.body.gaCode)) {
        errors.push(`invalid Google Authenticator code`)
    }

    req.session.gaCode = req.body.gaCode
    req.session.save()

    if (errors.length > 0) {
        req.session.flash = {
            type: 'danger',
            intro: 'Error',
            message: errors.join(', ')
        }         
        res.redirect(303, '/authga')
    } else {
        res.redirect(303, '/authfaceimage')        
    }
}

exports.authfaceimage = (req, res) => {
    req.session.base64Str = req.body.base64Str
    req.session.save()
    res.redirect(303, '/authresult')
}

exports.authresult = (req, res) => {
    res.redirect(303, '/')
}

exports.maxChevron = (req, res) => {
    req.session.maxChevron = req.body.maxChevron
    req.session.save()
}

exports.deleteSession = (req, res) => {
    req.session.destroy()
}