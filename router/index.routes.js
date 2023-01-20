const auth = require('./auth.routes')
const client = require('./client.routes')
const oauth2 = require('./oauth2.routes')

function renderRoutes(app) {
    app.use('/auth', auth)
    app.use('/client', client)
    app.use('/oauth2', oauth2)
}

module.exports = renderRoutes
