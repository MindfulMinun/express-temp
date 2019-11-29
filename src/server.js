import express from 'express'
import mustacheExpress from 'mustache-express'
import { resolve } from 'path'

const app = express()
const root = resolve(__dirname + '/../')

// Mustashe
app.engine('mst', mustacheExpress(__dirname + '/public', '.mst'))
app.set('view engine', 'mustache')

// For CSS and JS
app.use(express.static('public'))
app.use(express.static('dist'))

// Routing
app.get('/', function (req, res) {
    const lang = getLang(req)
    res.render(`${root}/public/index.mst`, {
        data: "Hello world!"
    })
})

app.get('/css/:sheet', function (req, res) {
    res.sendFile(`${root}/public/css/${req.params.sheet}`)
})

app.get('/js/:script', function (req, res) {
    res.sendFile(`${root}/dist/${req.params.script}`)
})

app.use(function (req, res) {
    res.status(404)

    // respond with html page
    if (req.accepts('html')) {
        res.render(`${root}/public/404.mst`, { url: req.url })
        return
    }
  
    // respond with json
    if (req.accepts('json')) {
        res.send({ error: 'Not found' })
        return
    }
  
    // default to plain-text. send()
    res.type('txt').send('Not found')
})

// Start listening
app.listen(process.env.PORT || 8080, function () {
    console.log('Server is live')
})


/**
 * Returns a supported language
 * @param {Request} req - The request lol
 * @returns {string} A supported language
 * @author MindfulMinun
 * @since Oct 19, 2019
 * @version 1.0.0
 */
function getLang(req) {
    const supported = ['en', 'es']
    const qLang = (req.query.lang || '').slice(0, 2)
    const browser = req.acceptsLanguages(supported)

    if (supported.includes(qLang)) { return qLang }
    if (browser) return browser
    return 'en'
}
