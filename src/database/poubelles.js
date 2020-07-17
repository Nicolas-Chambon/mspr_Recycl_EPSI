const database = require('./database');


const getPoubellesEntrepriseByDeviceId = async(device_id) => {
    try {

        return await database
            .from("POUBELLES")
            .leftJoin('ENTREPRISE', 'POUBELLES.SIRET', 'ENTREPRISE.SIRET')
            .select("*")
            .where({DEVICE_ID: device_id})


    } catch (e) {
        console.error(e)
    }
}



module.exports = {
    getPoubellesEntrepriseByDeviceId,
}