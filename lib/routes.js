const speakeasy = require('speakeasy')
const async = require('async')
const fs = require('fs')
const path = require('path')
const utils = require('./utils')

// ********* main menu *********//
exports.mainmenu  = (req, res) => {
    utils.initSession(req)
    res.render('mainmenu', {layout: 'standard'})
}

exports.maxChevron = (req, res) => {
    let maxChevron = req.session.maxChevron
    res.json(maxChevron)
}


// ********* create *********//

exports.unamepwdSession = (req, res) => {
    res.json({username: req.session.username, password: req.session.password, repassword: req.session.repassword})
}
exports.unamepwd  = (req, res) => res.render('unamepwd', {layout: 'create'})

exports.passwordRules = (req, res) => res.render('passwordRules', {layout: 'standard'})
exports.disallowedPasswords = (req, res) => res.render('disallowedPasswords', {layout: 'standard'})

exports.privateKey = (req, res) => {
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
}

exports.gaSession = (req, res) => {
    res.json({privateKey: req.session.privateKey, qrcodeData: req.session.qrcodeData})
}
exports.ga  = (req, res) => res.render('ga', {layout: 'create'})

exports.faceimageSession = (req, res) => {
/*    res.json({filename1: req.session.filename1, filename2: req.session.filename2, filename3: req.session.filename3,
                    base64Str1: req.session.base64Str1, base64Str2: req.session.base64Str2, base64Str3: req.session.base64Str3})*/
      res.json({filename1: req.session.filename1, filename2: req.session.filename2, filename3: req.session.filename3})                    
}
exports.usernameSession = (req, res) => {
    res.json({username: req.session.username})
}
exports.faceimage  = (req, res) => res.render('faceimage', {layout: 'create'})

exports.createuserSession = (req, res) => {
    /*res.json({username: req.session.username, password: req.session.password,
        privateKey: req.session.privateKey,
        filename1: req.session.filename1, filename2: req.session.filename2, filename3: req.session.filename3})        */
    res.json({username: req.session.username, password: req.session.password,
        privateKey: req.session.privateKey,
        filename1: 'john1.png', filename2: req.session.filename2, filename3: req.session.filename3})        
    
}
exports.createuser  = (req, res) => res.render('createuser', {layout: 'create'})



// ********* authenticate *********//
exports.authunamepwdSession = (req, res) => {
    res.json({username: req.session.username, password: req.session.password})
}
exports.authunamepwd = (req, res) => res.render('authunamepwd', {layout: 'authenticate'})

exports.authgaSession = (req, res) => {
    res.json({gaCode: req.session.gaCode})    
}
exports.authga = (req, res) => res.render('authga', {layout: 'authenticate'})

exports.imagefiles = (req, res) => {
    const dirs = ['/images','/uploads']
    const filenames = []

    async.eachSeries(dirs, (dir, nextDir) => {
        const fullPath = path.join(__dirname, '../data', dir)
        fs.readdir(fullPath, (err, files) => {
            if (err) {
                console.error(err)
            }
            async.eachSeries(files, (file, nextFile) => {
                let id = file.split('.').slice(0, -1).join('.')
                let shortPath = path.join(dir, file)
                let longPath = path.join(fullPath, file)
                filenames.push({id: id, shortPath: shortPath, longPath: longPath})
                nextFile()                
            })
            nextDir()
        })
    }, () => {
        res.send(filenames)
    })
}

exports.authfaceimage = (req, res) => res.render('authfaceimage', {layout: 'authenticate'})
exports.authresultSession = (req, res) => {
    res.json({username: req.session.username, password: req.session.password, gaCode: req.session.gaCode, base64Str: req.session.base64Str})    
}
exports.authresult = (req, res) => res.render('authresult', {layout: 'authenticate'})



// ********* HTTP errors *********//
exports.notFound = (req, res) => res.render('404', {layout: 'httpError'})
exports.serverError = (err, req, res, next) => {
    res.locals.errorMessage = err
    res.render('500', {layout: 'httpError'})
}
