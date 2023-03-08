const Router = require('express')
const router = Router()

// middlewares
const isAuthenticated = require('../utils/middleware/isAuthenticated')

router.get('/', isAuthenticated, (req, res) => {
    console.log('Cookies')
    console.log(req.cookies)
    
    res.render('home')
})

module.exports = router