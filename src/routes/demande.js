const express = require('express');
const router = express.Router();


const {getAllDemandes, getDemandeById,getAllDemandesFromToDate,getAllDemandesNoSubmit, assignDemandes} = require('../database/demandes')
const {getDetailDemandeByDemandeId} = require('../database/detailDemande')
const {getTourneeByDate,getPoidRestantTournee} = require('../database/tournee')
const {getAllSites} = require('../database/sites')

const permit = require ('../middleware/permit')

router.use(permit(['directeur','chauffeur']))


router.get('/assign-all', function (req, res) {

  assignDemandes().then(() => {

    res.status(200).json({success:'Assign Success'});


  }).catch((e) => {
    console.error(e)
    res.status(400).json(e)
  })

})


router.get('/all-sites', function (req, res) {

    getAllSites().then((data) => {

        res.status(200).json(data);


    }).catch((e) => {
        console.error(e)
        res.status(400).json(e)
    })

})

router.get('/demande/:id', function (req, res) {
            //If token is successfully verified, we can send the autorized data
            getDemandeById(req.params.id)
                .then((dataDemande) => {
                    if (!dataDemande || dataDemande.length === 0) {
                        console.log("empty");
                        res.status(200).json({});
                        return;
                    }
                    getDetailDemandeByDemandeId(req.params.id)
                        .then((dataDetailDemande) => {
                            dataDemande[0].DETAILDEMANDES = dataDetailDemande;
                            res.json(dataDemande[0]);
                        })
                        .catch(e => console.error(e))

                })
                .catch(e => console.error(e));


})

router.get('/demandes', function (req, res) {
            //If token is successfully verified, we can send the autorized data
            getAllDemandes()
                .then((data) => {
                    if (!data || data.length === 0) {
                        console.log("empty");
                        res.status(200).json({});
                        return;
                    }
                    res.json(data);
                })
                // .finally(() => {
                //     database.destroy();
                // })
                .catch(e => console.error(e));
            console.log('SUCCESS: Connected to protected route');

})

router.get('/demandesnosubmit', function (req, res) {
    //If token is successfully verified, we can send the autorized data
    getAllDemandesNoSubmit()
        .then((data) => {
            if (!data || data.length === 0) {
                console.log("empty");
                res.status(200).json({});
                return;
            }
            // for(let i in data){
            //     console.log(data[i])
            // }
            // getTourneeByDate("a")
            //     .then((dataTournee) =>{
            //         console.log(dataTournee)
            //     })
            //     .catch((e)=>console.error(e))



            res.json(data);

        })
        // .finally(() => {
        //     database.destroy();
        // })
        .catch(e => console.error(e));
    console.log('SUCCESS: Connected to protected route');

})



module.exports = router;