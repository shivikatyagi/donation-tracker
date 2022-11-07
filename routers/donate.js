const express = require('express');
const Donate = require('../models/donate'); 
const auth = require('../middleware/auth');
const router = express.Router();

router.post("/donate", auth ,  async (req, res) => {
    const donation = await Donate({
              ...req.body,
              donatedby: req.user._id
          })
            try {
                await donation.save((err, data) => {
                  if (err) 
                    return res.status(400).json({ error:err });
                  if (data) 
                    return res.status(201).json({ res:data });
                })
            }
            catch (e) { res.status(404).json({error:'404 ERROR'}) }
  });
  
router.get("/mydonations/:id",auth , (req, res) => {
  const { id } = req.params;
  console.log("Used Id is :", id);
  const yourdonation = Donate.find({ donatedby: id })
  if(!yourdonation)
  {
    return res.status(404).send("No donations found")
  }
    res.send(yourdonation)
  });

  router.get("/alldonations",auth , async (req, res) => {
    try {
    const allDonation = await Donate.find({})
    if(!allDonation)
    {
      return res.status(404).send("No donations found")
    }
    else { res.send(allDonation) }
  }
  catch (e) 
    { res.status(404).json({error:'404 ERROR'}) }
    });

module.exports = router