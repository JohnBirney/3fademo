const express = require('express')
const exphbs  = require('express-handlebars')
const cookieParser = require('cookie-parser')
const { credentials } = require('./config')
const expressSession = require('express-session')
const flashMiddleware = require('./lib/middleware/flash')
const blacklistMiddleware = require('./lib/middleware/blacklist')
const routes = require('./lib/routes')
const actions = require('./lib/actions')
const utils = require('./lib/utils')
//const disallowedPasswords = require('./lib/middleware/disallowedPasswordList')

const port = process.env.PORT || 3333
const app = express()

app.engine('handlebars', exphbs({
/*    defaultLayout: 'main',*/
    defaultLayout: 'standard',
    helpers: {
        section: function(name, options) {
            if(!this._sections) this._sections = {}
            this._sections[name] = options.fn(this)
            return null
        },
    }
}))
app.set('view engine', 'handlebars')

app.use(express.urlencoded({ extended: true, limit: '5mb' }))
app.use(express.json({limit: '5mb'}))
app.use(cookieParser(credentials.cookieSecret))
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    //saveUninitialized: true,
    secret: credentials.cookieSecret,
    cookie: {sameSite: 'strict'}
}))
app.use('/public', express.static(__dirname + '/public'))
app.use('/images', express.static(__dirname + '/data/images'))
app.use('/uploads', express.static(__dirname + '/data/uploads'))
app.use('/css', express.static(__dirname + '/public/css'))
app.use('/js', express.static(__dirname + '/public/js'))
app.use('/models', express.static(__dirname + '/public/models'))

app.use(flashMiddleware)
app.use(blacklistMiddleware)

app.get('/', routes.mainmenu)

app.get('/maxChevron', routes.maxChevron)
app.post('/maxChevron', actions.maxChevron)

app.get('/imagefiles', routes.imagefiles)
//app.get('/privateKey', actions.privateKey)
app.get('/privateKey', routes.privateKey)
app.post('/deleteSession', actions.deleteSession)

app.get('/disallowedPasswords', routes.disallowedPasswords)
app.get('/passwordRules', routes.passwordRules)

app.get('/unamepwdSession', routes.unamepwdSession)
app.get('/unamepwd', routes.unamepwd)
app.post('/unamepwd', actions.unamepwd)

app.get('/gaSession', routes.gaSession)
app.post('/gaSession', actions.gaSession)
app.get('/ga', routes.ga)
app.post('/ga', actions.ga)

app.get('/faceimageSession', routes.faceimageSession)
app.post('/faceimageSession', actions.faceimageSession)
app.get('/usernameSession', routes.usernameSession)
app.get('/faceimage', routes.faceimage)
app.post('/faceimage', actions.faceimage)
app.post('/saveFile', actions.saveFile)

app.get('/createuserSession', routes.createuserSession)
app.get('/createuser', routes.createuser)
app.post('/createuser', actions.createUser)

app.get('/authunamepwdSession', routes.authunamepwdSession)
app.get('/authunamepwd', routes.authunamepwd)
app.post('/authunamepwd', actions.authunamepwd)
app.get('/authgaSession', routes.authgaSession)
app.get('/authga', routes.authga)
app.post('/authga', actions.authga)
app.get('/authfaceimage', routes.authfaceimage)
app.post('/authfaceimage', actions.authfaceimage)
app.get('/authresultSession', routes.authresultSession)
app.get('/authresult', routes.authresult)
app.post('/authresult', actions.authresult)

app.use(routes.notFound)
//app.use(routes.serverError)

app.listen(port, () => {
    console.log(`Listening on port ${port} ...`)
})