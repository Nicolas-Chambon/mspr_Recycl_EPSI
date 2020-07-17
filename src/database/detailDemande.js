const database = require('./database');
const changeDates = require('../utilities/changeDates');



const getDetailDemandeByDemandeId = async(id) => {
    try {
        return await database
            .table("DETAILDEMANDE")
            .leftJoin('TYPEDECHET', 'DETAILDEMANDE.NOTYPEDECHET', 'TYPEDECHET.NOTYPEDECHET')
            .where("DETAILDEMANDE.NODEMANDE", id)
    } catch (e) {
        console.error(e)
    }
}

const addDetailDemandeAuto = async(weigtValue, NODEMANDE, NOTYPEDECHET) => {
    try {
        return await
            database("DETAILDEMANDE")
                .returning(["QUANTITEDEMANDE", "NODEMANDE", "NOTYPEDECHET"])
                .insert({
                    QUANTITEDEMANDE:weigtValue,
                    NODEMANDE: NODEMANDE,
                    NOTYPEDECHET: NOTYPEDECHET
                })

    } catch (e) {
        console.error(e)
    }
}


module.exports = {
    addDetailDemandeAuto,
    getDetailDemandeByDemandeId
}