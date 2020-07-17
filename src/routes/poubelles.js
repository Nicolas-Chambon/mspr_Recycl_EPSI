const express = require('express');
const router = express.Router();

const {getRecordPoubelles} = require('../database/recordPoubelles')


router.get('/get-record-poubelles', function (req, res) {

  getRecordPoubelles().then((data) => {

    res.status(200).json(data);


  }).catch((e) => {
    console.error(e)
    res.status(400).json(e)
  })

})


module.exports = router;