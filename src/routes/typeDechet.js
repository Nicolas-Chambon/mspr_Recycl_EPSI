const express = require('express');
const router = express.Router();

const database = require('../database/database');


const {getSumByTypeDechet, getSumForOneTypeDechet, getSumTypeDechetForOneSite, getAllTypeDechet} = require('../database/typeDechet')


router.get('/all-type-dechet', function (req, res) {


    getAllTypeDechet()
        .then((data) =>{

            res.status(200).json(data);

        })
        .catch((e) => {
            console.error(e)
            res.status(400).json(e);
        })

})

router.post('/sumtypedechet', function (req, res) {
    //If token is successfully verified, we can send the autorized data

    let dateFrom = req.body.dateFrom;
    let dateTo = req.body.dateTo;


    // let dateFrom = "30/09/2018"
    // let dateTo = "02/12/2020"

    getSumByTypeDechet(dateFrom, dateTo)
        .then((dataSumTypeDechet) =>{

            res.status(200).json(dataSumTypeDechet);

        })
        .catch((e) => console.error(e))

})

router.post('/sumbytypedechet', function (req, res) {
    //If token is successfully verified, we can send the autorized data

    let id = req.body.id
    let dateFrom = req.body.dateFrom;
    let dateTo = req.body.dateTo;


    // let dateFrom = "30/09/2018"
    // let dateTo = "02/12/2020"

    getSumForOneTypeDechet(id, dateFrom, dateTo)
        .then((dataSumTypeDechet) =>{



            res.status(200).json(dataSumTypeDechet);

        })
        .catch((e) => console.error(e))

})

router.post('/sum-type-dechet-by-site', function (req, res) {
    //If token is successfully verified, we can send the autorized data

    let id = req.body.id
    let dateFrom = req.body.dateFrom;
    let dateTo = req.body.dateTo;


    // let dateFrom = "30/09/2018"
    // let dateTo = "02/12/2020"

    getSumTypeDechetForOneSite(dateFrom, dateTo, id)
        .then((dataSumTypeDechet) =>{

            res.status(200).json(dataSumTypeDechet);

        })
        .catch((e) => console.error(e))

})



module.exports = router;