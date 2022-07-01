const router = require("express").Router();
const Comment = require("../models/comment");

//send comment

router.post("/", async (req, res) => {
    const newComment = new Comment(req.body);

    try {
        await newComment.save();
        return res.status(200).json({ success: true, message: 'send comment success', newComment })
    } catch (err) {
        return res.status(500).json({ success: false, message: 'send comment fail', err })
    }
});
//update comment

router.put("/:id", async (req, res) => {
    console.log(req.body)
    try {
        const comment = await Comment.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, { new: true })
        return res.status(200).json({ success: true, message: 'update comment success', comment })
    } catch (err) {
        return res.status(500).json({ success: false, message: 'update comment fail', err })
    }
});


//get all comment post

router.get("/:postId", async (req, res) => {
    try {
        const comments = await Comment.find({
            postId: req.params.postId,
        });
        return res.status(200).json({ success: true, message: 'get all comments  post success', comments })
    } catch (err) {
        return res.status(500).json({ success: false, message: 'get all comments post fail', err })
    }
});


//delete

router.delete("/:id", async (req, res) => {
    try {
        await Comment.findOneAndDelete({_id:req.params.id})
        return res.status(200).json({ success: true, message: 'delete comments success' })
    } catch (err) {
        return res.status(500).json({ success: false, message: 'delete comments fail', err })
    }
});
//like comment
router.put("/like/:commentId", async (req, res) => {
    try {
        const isComment = await Comment.findOne({
            _id: req.params.commentId,
        });
        if (isComment.like.includes(req.body.userId)) {
            const comment = await Comment.findByIdAndUpdate({ _id: req.params.commentId }, { $pull: { like: userId } }, { new: true })
            return res.status(200).json({ success: true, message: 'dislike comments success', comment })
        }
        else {
            const comment = await Comment.findByIdAndUpdate({ _id: req.params.commentId }, { $push: { like: userId } }, { new: true })
            return res.status(200).json({ success: true, message: 'like comments success', comment })
        }
    } catch (err) {
        return res.status(500).json({ success: true, message: 'send comments fail', err })
    }
});

module.exports = router;