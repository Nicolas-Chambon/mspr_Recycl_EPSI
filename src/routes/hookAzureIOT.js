const database = require("../database/database");
const express = require("express");

const {getPoubellesEntrepriseByDeviceId} = require('../database/poubelles')
const {addDemandeAuto}= require('../database/demandes')
const {addDetailDemandeAuto}= require('../database/detailDemande')
const {addRecordPoubelle}= require('../database/recordPoubelles')


const router = express.Router();
router.post("/iot/hook", (req, res) => {

  console.log("Reponse : ",req.body.device.id); // Call your action on the request here

  const device_id = req.body.device.id;
  const weightValue = req.body.device.telemetry.Connected_Waste_Bin_7dd.Weight.value;

  getPoubellesEntrepriseByDeviceId(device_id)
      .then( (poubelle) => {
        const typeDechet = poubelle[0].NOTYPEDECHET;
        let date = new Date(); //by default now
        let today = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
        addDemandeAuto(today,poubelle[0].SIRET,poubelle[0].NOSITE,poubelle[0].DEVICE_ID)
            .then( (demande) => {
              console.log(demande[0].NODEMANDE)
              addDetailDemandeAuto(weightValue, demande[0].NODEMANDE, typeDechet)
                  .then( (detailDemande) => {
                    console.log(detailDemande)
                  })
                  .catch( (e) => {
                    console.log(e)
                  })
            })
            .catch( (e) => {
              console.log(e)
            })
      })
      .catch((e)=>{
        console.error(e)
      })

  console.log(weightValue)

  res.status(200).end(); // Responding is important
})


router.post("/iot/hook/recordpoubelle", (req, res) => {




console.log(req.body.device.telemetry.Connected_Waste_Bin_7dd)
    const fillLevel = req.body.device.telemetry.Connected_Waste_Bin_7dd.FillLevel.value;
    const odorMeter = req.body.device.telemetry.Connected_Waste_Bin_7dd.OdorMeter.value;
    const weight = req.body.device.telemetry.Connected_Waste_Bin_7dd.Weight.value;
    const deviceId = req.body.device.id;




    addRecordPoubelle(deviceId,fillLevel,odorMeter,weight)


    res.status(200).end(); // Responding is important

})

module.exports = router;