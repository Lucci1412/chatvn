const BoxMessenger = require('../Models/boxMessenger')
const express = require('express')
const router = express.Router()
const User = require('../Models/user.js');
router.post("/", async (req, res) => {
  const newBoxMessenger = new BoxMessenger({
    members: [req.body.senderId, req.body.userId],
  });
  try {
    await newBoxMessenger.save();
    return res.status(200).json({ success: true, message: 'Create boxMessenger success', newBoxMessenger })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Create boxMessenger fail', error })
  }
});


// get boxMessenger

router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  try {

    const boxMessenger = await BoxMessenger.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    return res.status(200).json({ success: true, message: 'get boxMessenger success', boxMessenger })
  } catch (err) {
  return res.status(500).json({ success: false, message: 'get boxMessenger fail', err })
}
});

router.get("/find/:userId", async (req, res) => {
  try {
    const listBoxMessenger = await BoxMessenger.find({
      members: { $in: [req.params.userId] },
    });
    
    return res.status(200).json({ success: true, message: 'get list boxMessenger user success', listBoxMessenger })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'get list boxMessenger fail', err })
  }
});

module.exports = router;

