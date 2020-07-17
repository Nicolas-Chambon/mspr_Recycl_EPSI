const database = require('./database');
const changeDates = require('../utilities/changeDates');


const addRecordPoubelle = async(deviceId, fillLevel, odorMeter, weight) => {
    try {
        return await
            database("RECORDSPOUBELLE")
                .insert({
                    DEVICE_ID: deviceId,
                    DATE_RELEVE : Date.now(),
                    FILLLEVEL: fillLevel,
                    ODORMETER: odorMeter,
                    WEIGHT: weight
                })

    } catch (e) {
        console.error(e)
    }
}

const getRecordPoubelles = async() => {
  try {
    return await
      database("RECORDSPOUBELLE")

  } catch (e) {
    console.error(e)
  }
}




module.exports = {
    addRecordPoubelle,
    getRecordPoubelles
}