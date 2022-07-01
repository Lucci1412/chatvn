
const express = require('express')
const router = express.Router()
const Report = require('../Models/report.js');
router.post("/", async (req, res) => {
  const newReport = new Report(
    req.body
  );
  try {
    await newReport.save();
    return res.status(200).json({ success: true, message: 'Send report success', newReport })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Create report fail', error })
  }
});


// get boxMessenger

router.get("/:type", async (req, res) => {
  console.log(req.params.type)
  try {
           const reports=await Report.find({ type: req.params.type})
           return res.status(200).json({ success: true, message: 'get report success', reports })
    
  } catch (err) {
  return res.status(500).json({ success: false, message: 'get boxMessenger fail', err })
}
});

router.delete("/:id", async (req, res) => {
  try {
     await Report.findOneAndDelete({_id:req.params.id})
    return res.status(200).json({ success: true, message: 'delete report success' })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'delete report fail', err })
  }
});

//GET report STATS
router.get("/stats/:year", async (req, res) => {

  try {
    const reportStats = await Report.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          newReports: { $sum: 1 },
        },
      },
    ]);
    return res.status(200).json({ success: true, message: 'get report stats success', reportStats })
  } catch (err) {
      return res.status(500).json({ success: false, message: 'fail',  })
  }
});
//
module.exports = router;

