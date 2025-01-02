const express = require ('express')
const router = express.Router()
const { register, login, getAuth, deleteAuth, forgetPassword, resetpassword } = require('../controller/Auth')
router.post('/register', register)
router.post('/login', login)
router.get('/getauth', getAuth)
router.delete('/deleteauth/:id', deleteAuth)
router.post('/forgetPassword', forgetPassword)
router.post('/reset-password/:token', resetpassword)


module.exports = router