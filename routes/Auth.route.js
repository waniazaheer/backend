const express = require ('express')
const router = express.Router()
const { register, login, getAuth, deleteAuth, forgetPassword, resetPassword, } = require('../controller/Auth')
router.post('/register', register);

router.post('/login', login);

router.get('/getauth', getAuth)
router.delete('/deleteauth/:id', deleteAuth)
router.post('/forgetPassword', forgetPassword);

router.post('/reset-password/:token', resetPassword);


module.exports = router