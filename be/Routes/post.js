const express = require('express')
const router = express.Router()
const User = require('../Models/user.js')
const Post = require('../Models/post.js')
const Comment = require("../models/comment");
const cloudinary = require('../utils/cloudinary.js');
const upload = require("../utils/multer.js");
// tạo bài viết 

router.post('/', upload.single("file"), async (req, res) => {

    try {
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path)
            const newPost = new Post({
                userId: req.body.userId,
                img: result.secure_url,
                cloudinary_id: result.public_id,
                content: req.body.content,
            });
            await newPost.save();
            return res.status(200).json({ success: true, message: 'Create post success ', newPost })
        } else {
            const newPost = new Post(req.body)
            await newPost.save();
            return res.status(200).json({ success: true, message: 'Create post success', newPost })
        }

    } catch (error) {
        return res.status(500).json({ success: false, message: 'error', error })
    }

})

// chỉnh sửa bài viết 
router.put('/:id', upload.single("file"), async (req, res) => {
   try {
    if (req.body.resultImg === 'true') {
        const post = await Post.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, { new: true })
        return res.status(200).json({ success: true, message: 'Update post success ', post })
    }
    else {
        
        const getPost = await Post.findOne({ _id: req.params.id })
        getPost.img && await cloudinary.uploader.destroy(getPost.cloudinary_id);
        if (req.file) {
            console.log(' co anh ')
            const result = await cloudinary.uploader.upload(req.file.path)
            const newData ={
                img: result.secure_url,
                cloudinary_id: result.public_id,
                content: req.body.content,
            };
            const post = await Post.findOneAndUpdate({ _id: req.params.id }, { $set: newData }, { new: true })
            return res.status(200).json({ success: true, message: 'Update post success ', post })
        }
        else {
            getPost.img='';
            getPost.cloudinary_id='';
            getPost.content=req.body.content;
            const post = await Post.findOneAndUpdate({ _id: req.params.id }, { $set: getPost }, { new: true })
            return res.status(200).json({ success: true, message: 'Update post success ', post })
        }
    }

   } catch (error) {
    return res.status(500).json({ success: false, message: 'Update post fail ', error })
   }

   
})


//xoá bài biết
router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.id })
        if (post.cloudinary_id) {
            await cloudinary.uploader.destroy(post.cloudinary_id);
        }
        await Post.findByIdAndDelete({ _id: req.params.id })
        await Comment.remove({ postId: req.params.id }); 
        return res.status(200).json({ success: true, message: 'Xoá bài viết thành công', })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'error', error })
    }
})
//lấy 1 bài post
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.id })
        return res.status(200).json({ success: true, message: 'get post success', post })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'error', error })
    }
})

//get all post user
router.get('/profile/:userId', async (req, res) => {
    try {
        const posts = await Post.find({ userId: req.params.userId })
        return res.status(200).json({ success: true, message: 'get all post user success', posts })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'error', error })
    }
})

//get post timeline
router.get('/timeline/:userId', async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.userId })
        const listPostMe = await Post.find({ userId: user._id })

        const postFriend = await Promise.all(user.following.map(user => {
            return Post.find({ userId: user })
        }))
        const posts = listPostMe.concat(...postFriend)
        return res.status(200).json({ success: true, message: "get post timeline success", posts })
    } catch (error) {
        return res.status(500).json({ success: false, message: "error", error })
    }
})
// like bài viết 
router.put('/like/:id', async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.id })
        if (post.like.includes(req.body.id)) {
            const newPost = await Post.findOneAndUpdate({ _id: req.params.id }, { $pull: { like: req.body.id } }, { new: true })
            return res.status(200).json({ success: true, message: "unlike success", newPost })
        }
        else {
            const newPost = await Post.findOneAndUpdate({ _id: req.params.id }, { $push: { like: req.body.id } }, { new: true })
            return res.status(200).json({ success: true, message: " like success", newPost })
        }

    } catch (error) {
        return res.status(500).json({ success: false, message: "err", error })
    }
})
// lưu bài viết 
router.put('/save/:id', async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.id })
        if (post.savePost.includes(req.body.id)) {
            const newPost = await Post.findOneAndUpdate({ _id: req.params.id }, { $pull: { savePost: req.body.id } }, { new: true })
            return res.status(200).json({ success: true, message: "unsave post success", newPost })
        }
        else {
            const newPost = await Post.findOneAndUpdate({ _id: req.params.id }, { $push: { savePost: req.body.id } }, { new: true })
            return res.status(200).json({ success: true, message: "save post success", newPost })
        }

    } catch (error) {
        return res.status(500).json({ success: false, message: "err", error })
    }
})
//get post save
router.get('/savepost/:id', async (req, res) => {
    try {
        const savePost = await Post.find({
            savePost: { $in: [req.params.id] },
        });
        return res.status(200).json({ success: true, message: 'get savePost success', savePost })

    } catch (error) {
        return res.status(500).json({ success: false, message: 'error', error })
    }

})


//GET USER STATS
router.get("/stats/:year", async (req, res) => {  
    try {
      const postStats = await Post.aggregate([
        {
          $project: {
    
            // year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
        },
        {
          $group: {
            _id: "$month",
            newPosts: { $sum: 1 },
          },
        },
      ]);
      return res.status(200).json({ success: true, message: 'get post stats success', postStats })
    } catch (err) {
        return res.status(500).json({ success: false, message: 'fail',  })
    }
  });

// search query

module.exports = router