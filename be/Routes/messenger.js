const router = require("express").Router();
const Messenger = require("../models/Messenger");

//send messenger

router.post("/", async (req, res) => {
  const newMessenger = new Messenger(req.body);

  try {
     await newMessenger.save();
    return res.status(200).json({ success: true, message: 'send messenger success', newMessenger })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'send messenger fail', err })
  }
});

//get

router.get("/:boxMessengerId", async (req, res) => {
  try {
    const messengers = await Messenger.find({
        boxMessengerId: req.params.boxMessengerId,
    });
    return res.status(200).json({ success: true, message: 'get messenger success', messengers })
  } catch (err) {
    return res.status(500).json({ success: true, message: 'send messenger fail', err })
  }
});

module.exports = router;