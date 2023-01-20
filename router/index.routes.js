const auth = require('./auth.routes')
const client = require('./client.routes')

function renderRoutes(app) {
    app.use('/auth', auth)
    app.use('/client', client)
}

module.exports = renderRoutes
