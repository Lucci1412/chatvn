const router = require("express").Router();
const Notification = require("../models/notification");
const { array } = require("../utils/multer");
//send notify

router.post("/", async (req, res) => {
    const newNotification = new Notification(req.body);
    try {
        await newNotification.save();
        return res.status(200).json({ success: true, message: 'send notification success',newNotification})
    } catch (err) {
        return res.status(500).json({ success: false, message: 'send notification fail', err })
    }
});
//update notification
router.put("/:notificationId", async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate({ _id: req.params.notificationId }, { $set: req.body }, { new: true })
        return res.status(200).json({ success: true, message: 'update notification success', notification })
    } catch (err) {
        return res.status(500).json({ success: false, message: 'update notification fail', err })
    }
});
//delete notification
router.delete("/:notificationId", async (req, res) => {
    try {
        await Notification.findOneAndDelete({ _id: req.params.notificationId })
        return res.status(200).json({ success: true, message: 'Xoá thông báo thành công' })
    } catch (err) {
        return res.status(500).json({ success: false, message: 'delete notification fail', err })
    }
});
//get all notification user

router.get("/:userId", async (req, res) => {
    const { limit } = req.query

    try {
        const result = await Notification.find({
            receiverId: req.params.userId,
        })
        const notifications = result.slice(-limit)
        const array = result.filter(item => item.status === true);
        // const length=array.length
        return res.status(200).json({ success: true, message: 'get notification success', notifications, length: array.length })
    } catch (err) {
        return res.status(500).json({ success: true, message: 'get notification fail', err })
    }
});

module.exports = router;