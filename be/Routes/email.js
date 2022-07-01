
const express = require('express')
const router = express.Router()
const nodemailer = require("nodemailer");
// const dotenv = require('dotenv')
// dotenv.config()
router.post('/',async(req,res)=>{
    const admin="chatvnsp@gmail.com"
    const password="dvjmbbmpxzpbvkgr"
    const {email,title,content}=req.body
    let transporter = nodemailer.createTransport({
        service:'gmail',
        auth: {
          user: admin, // generated ethereal user
          pass: password // generated ethereal password
        },
      });
    try {
       await transporter.sendMail({
            from: admin, // sender address
            to: email, // list of receivers
            subject: title, // Subject line
            text: content, // plain text body
            html: `<p>Xin chào <strong>${email}</strong>. ${content}.Mọi thắc mắc mắc liên hệ ${admin} </p>`, // html body
          });
          return res.status(200).json({ success: true, message: 'sendMailSuccess', })
    } catch (error) {
        res.status(500).json({messenger: 'send mail fail',error})  
    }

})


module.exports = router 