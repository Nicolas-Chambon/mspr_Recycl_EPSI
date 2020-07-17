const express = require('express');
const router = express.Router();

const database = require('../database/database');


const {getNbTourneeByEmployee} = require('../database/tournee')


router.get('/nbtourneebyemployee', function (req, res) {
    //If token is successfully verified, we can send the autorized data

    // let dateFrom = req.body.nbTournee;

    getNbTourneeByEmployee()
        .then((dataNbTourneeByEmployee) =>{

            res.status(200).json(dataNbTourneeByEmployee);

        })
        .catch((e) => console.error(e))



})



module.exports = router;