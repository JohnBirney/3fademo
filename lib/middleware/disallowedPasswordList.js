const Authentication = require('../classes/Authentication')

const getDisallowedPasswords = () => Authentication.disallowedPasswords()

const disallowedPasswordsMiddleware = (req, res, next) => {

    /*if(!res.locals.partials) {
        res.locals.partials = {}
    }*/
    res.locals.disallowedPasswords = getDisallowedPasswords()
    next()
}
  
module.exports = disallowedPasswordsMiddleware
