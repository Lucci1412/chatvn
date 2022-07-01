const express = require('express')
const router = express.Router()
const User = require('../Models/user.js')
const Post = require('../Models/post.js')
const argon2 = require('argon2')
const nodemailer = require("nodemailer");
const cloudinary = require('../utils/cloudinary.js');
const upload = require("../utils/multer.js");
//update info user
router.put('/info/:userId',  async (req, res) => {
    try {
        if (req.body.password) {
            req.body.password = await argon2.hash(req.body.password);
        }
        console.log(req.body)
        await User.findByIdAndUpdate({ _id: req.params.userId }, { $set: req.body })
        return res.status(200).json({ success: true, message: 'Cập nhật thông tin thành công' })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'error', error })

    }
})
//block account
router.put('/block/:userId',  async (req, res) => {
        try {
            const user = await User.findOne({ _id: req.params.userId })
            if (user.blockAccount) {
              const newUser  =await User.findByIdAndUpdate({ _id: user._id }, { $set: { blockAccount:false } }, { new: true }).select('-password')
                return res.status(200).json({ success: true, message: 'Đã mở khoá tài khoản người dùng thành công',newUser })
            }
            else {
             const newUser =  await User.findByIdAndUpdate({ _id: user._id }, { $set: { blockAccount:true } }, { new: true }).select('-password')
                return res.status(200).json({ success: true, message: 'Đã khoá tài khoản người dùng thành công',newUser })
            }
        } catch (error) {
            return res.status(500).json({ success: false, message: 'error', error })
        }
    
})
//update avatar user
router.post('/avatar/:userId',  upload.single("avatar"), async (req, res) => {
    try {
        if (req.file) {
            const user = await User.findOne({ _id: req.params.userId })
            if (user.avatar === 'https://res.cloudinary.com/daqk2q9yp/image/upload/v1647350689/avatarDefault_ukaa76.jpg') {
                const result = await cloudinary.uploader.upload(req.file.path)
                const data = {
                    avatar: result.secure_url,
                    cloudinary_id: result.public_id,
                }
                await User.findByIdAndUpdate({ _id: req.params.userId }, { $set: data }, { new: true })
                return res.status(200).json({ success: true, message: 'Cập nhật ảnh đại diên thành công ' })
            }
            else {
                await cloudinary.uploader.destroy(user.cloudinary_id);
                const result = await cloudinary.uploader.upload(req.file.path)
                const data = {
                    avatar: result.secure_url,
                    cloudinary_id: result.public_id,
                }
                await User.findByIdAndUpdate({ _id: req.params.userId }, { $set: data }, { new: true })
                return res.status(200).json({ success: true, message: 'Update avatar success ' })
            }

        }
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Update avatar fail', error })
    }

})



// get user
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id }).select('-password -updatedAt')
        return res.status(200).json({ success: true, message: 'get user success', user })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'error', error })

    }
})
// get all user
router.get('/allUser/:id', async (req, res) => {
    try {
        const currentUser=await User.findOne({_id:req.params.id})
        if(currentUser.isAdmin){
            const getAll = await User.find({}).select('-password')
            const users=getAll.filter(user=>user.isAdmin===false)
        return res.status(200).json({ success: true, message: 'get all users success', users })
        }
        else{
            return res.status(200).json({ success: false, message: 'you not allow access',})
        }
        
    } catch (error) {
        return res.status(500).json({ success: false, message: 'error', error })

    }
})


//follow or unfollow
router.put('/follow/:id',  async (req, res) => {
    if (req.body.id !== req.params.id) {
        try {
            const me = await User.findOne({ _id: req.body.id })
            const user = await User.findOne({ _id: req.params.id })
            if (!user.followers.includes(me._id)) {
                await User.findByIdAndUpdate({ _id: user._id }, { $push: { followers: me._id } }, { new: true })
                const follow = await User.findByIdAndUpdate({ _id: me._id }, { $push: { following: user._id } }, { new: true }).select('-password -createdAt -updatedAt')
                return res.status(200).json({ success: true, message: 'follow success', follow })
            }
            else {
                await User.findByIdAndUpdate({ _id: user._id }, { $pull: { followers: me._id } }, { new: true })
                const follow = await User.findByIdAndUpdate({ _id: me._id }, { $pull: { following: user._id } }, { new: true }).select('-password -createdAt -updatedAt')
                return res.status(200).json({ success: true, message: 'unfollow success', follow })
            }

        } catch (error) {
            return res.status(500).json({ success: false, message: 'error', error })
        }
    }
})
//category
router.get('/category/:id', async (req, res) => {
    try {
        const post = await Post.find({ userId: req.params.id })
        const user = await User.findOne({ _id: req.params.id })

        const savePost = await Post.find({
            savePost: { $in: [req.params.id] },
        });
        const category = { postUser: post.length, following: user.following.length, followers: user.followers.length, savePost: savePost.length }
        return res.status(200).json({ success: true, message: 'get category success', category })

    } catch (error) {
        return res.status(500).json({ success: false, message: 'error', error })
    }

})



router.get('/search/:key',  async (req, res) => {

    const key = req.params.key.toLowerCase().trim()
    try {
        const resultsUser = await User.find({ $text: { $search: key } }).limit(10);
        const resultsPost = await Post.find({ $text: { $search: key } }).limit(10)
        return res.status(200).json({ success: true, message: "search success", resultsUser, resultsPost })
    } catch (error) {
        return res.status(500).json({ success: false, message: error })
    }

})


router.put('/countNotifyMess/:userId/:type', async (req, res) => {
    try {
        const { type, userId } = req.params
        const getUser = await User.findOne({ _id: userId })
        if (type == 1) {
            const countNotifyMess = await User.findByIdAndUpdate({ _id: userId }, { $set: { countNotifyMess: getUser.countNotifyMess + 1 } }, { new: true })
            return res.status(200).json({ success: true, message: "update success", count: countNotifyMess.countNotifyMess })
        }
        else if (type == 0) {
            const user = await User.findByIdAndUpdate({ _id: userId }, { $set: { countNotifyMess: 0 } }, { new: true })
            return res.status(200).json({ success: true, message: "update success", count: user.countNotifyMess, user })
        }
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error })
    }

})



//GET USER STATS
router.get("/stats/:year", async (req, res) => {
    const today = new Date();
    const latYear = today.setFullYear(today.setFullYear() - 1);
  
    try {
      const userStats = await User.aggregate([
        {
          $project: {
            month: { $month: "$createdAt" },
          },
        },
        {
          $group: {
            _id: "$month",
            newUsers: { $sum: 1 },
          },
        },
      ]);
      return res.status(200).json({ success: true, message: 'get post stats success', userStats })
    } catch (err) {
        return res.status(500).json({ success: false, message: 'fail',  })
    }
  });
//
 
module.exports = router 