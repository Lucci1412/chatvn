const express = require('express')
const argon2 = require('argon2');
const router = express.Router()
const User = require('../Models/user.js')
const jwt = require('jsonwebtoken')
const verifyToken = require('../Middleware/auth.js')


//Kiểm tra người dùng
router.get('/', verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.userId }).select('-password')
        if (!user)
            return res.status(400).json({ success: false, message: 'User not found' })
        res.json({ success: true, user })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})

// đăng kí
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body
    try {
        if (!username || !email || !password) return res.status(200).json({ success: false, message: 'Vui lòng điền đủ thông tin' })
        if (password.length<6) return res.status(200).json({ success: false, message: 'Mật khẩu dưới 6 kí tự' })
        if (await User.findOne({ email })) return res.status(200).json({ success: false, message: 'Email đã được sử dụng' })
        const hash = await argon2.hash(password);
        const registerUser = new User({ username, email, password: hash })
        await registerUser.save();

        const token = jwt.sign({userId: registerUser._id},process.env.ACCESS_TOKEN_SECRET)
        return res.status(200).json({ success: true, message: 'Đăng kí thành công',registerUser, token })

    } catch (error) {
        return res.status(500).json({ success: false, error })
    }

})


//đăng nhập
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) return res.status(200).json({ success: false, message: 'Vui lòng nhập email hoặc mật khẩu' });
        const isUser = await User.findOne({ email })
        if (!isUser) return res.status(200).json({ success: false, message: 'Địa chỉ email chưa được đăng kí' });
        if (password) {
            const isVerifyPassword = await argon2.verify(isUser.password, password)
            if (!isVerifyPassword) return res.status(200).json({ success: false, message: 'Sai mật khẩu' })
        }
        if (isUser.blockAccount) return res.status(200).json({ success: false, message: 'Tài khoản của bạn đã bị khoá' });
        const accessToken = jwt.sign(
            { userId: isUser._id },
            process.env.ACCESS_TOKEN_SECRET
        )
        return res.status(200).json({ success: true, message: 'Đăng nhập thành công', isUser, accessToken })

    } catch (error) {
        return res.status(500).json({ success: false, message: 'error', error })
    }

})

module.exports = router