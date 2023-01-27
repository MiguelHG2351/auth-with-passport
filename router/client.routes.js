const Router = require('express')
const router = Router()

router.get('/', (req, res) => {
    console.log('Cookies')
    console.log(req.signedCookies)
    
    res.render('home')
})

module.exports = router