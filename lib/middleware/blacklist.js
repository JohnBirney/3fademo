const Authentication = require('../classes/Authentication')

const getBlacklist = () => Promise.resolve(
    Authentication.blacklist()
)

/*const getBlacklist = () => Promise.resolve([
    {password: 'password'},
    {password: 'pa55word'},
    {password: 'qwerty'},
    {password: '12345'}
])*/

const blacklistMiddleware = async (req, res, next) => {

    if (!res.locals.partials) res.locals.partials = {}
    const blacklist = await req.session.blacklist //getBlacklist()
    res.locals.partials.blacklistContext = blacklist
    next()
}

module.exports = blacklistMiddleware