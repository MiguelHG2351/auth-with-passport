const Router = require('express')
const router = Router()

router.get('/', (req, res) => {
    console.log('Cookies')
    console.log(req.cookies)
    
    res.render('home')
})

module.exports = router