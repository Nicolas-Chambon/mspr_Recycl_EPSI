const database = require('./database');
const changeDates = require('../utilities/changeDates');



const getAllTypeDechet = async() => {
    try {
        return await
            database("TYPEDECHET")
    } catch (e) {
        console.error(e)
    }
}


const getSumByTypeDechet = async(dateFrom, dateTo) => {
    try {
        return await
            database("DETAILDEMANDE")
                .select("TYPEDECHET.NOMTYPEDECHET","TYPEDECHET.NOTYPEDECHET" )
                .sum("QUANTITEENLEVEE")
                .leftJoin("TYPEDECHET", "DETAILDEMANDE.NOTYPEDECHET", "TYPEDECHET.NOTYPEDECHET")
                .leftJoin("TOURNEE", "DETAILDEMANDE.NOTOURNEE", "TOURNEE.NOTOURNEE")
                .whereBetween("TOURNEE.DATETOURNEE", [dateFrom, dateTo])
                .groupBy('TYPEDECHET.NOMTYPEDECHET',"TYPEDECHET.NOTYPEDECHET")
    } catch (e) {
        console.error(e)
    }
}

const getSumTypeDechetForOneSite = async(dateFrom, dateTo, idSite) => {
    try {
        return await
            database("DETAILDEMANDE")
                .select("TYPEDECHET.NOMTYPEDECHET","TYPEDECHET.NOTYPEDECHET" )
                .sum("QUANTITEENLEVEE")
                .leftJoin("TYPEDECHET", "DETAILDEMANDE.NOTYPEDECHET", "TYPEDECHET.NOTYPEDECHET")
                .leftJoin("TOURNEE", "DETAILDEMANDE.NOTOURNEE", "TOURNEE.NOTOURNEE")
                .leftJoin("DEMANDE", "DETAILDEMANDE.NODEMANDE", "DEMANDE.NODEMANDE")
                .where("DEMANDE.NOSITE", idSite)
                .whereBetween("TOURNEE.DATETOURNEE", [dateFrom, dateTo])
                .groupBy('TYPEDECHET.NOMTYPEDECHET',"TYPEDECHET.NOTYPEDECHET")
    } catch (e) {
        console.error(e)
    }
}

const getSumForOneTypeDechet = async(id, dateFrom, dateTo) => {
    try {
        return await
            // database.raw(`SELECT QUANTITECOLLECTEE_PAR_TYPE_GLOBAL(${id},'${dateFrom}','${dateTo}') FROM DUAL`)
            database("DETAILDEMANDE")
                .select("TYPEDECHET.NOMTYPEDECHET","TYPEDECHET.NOTYPEDECHET" )
                .sum("QUANTITEENLEVEE")
                .leftJoin("TYPEDECHET", "DETAILDEMANDE.NOTYPEDECHET", "TYPEDECHET.NOTYPEDECHET")
                .leftJoin("TOURNEE", "DETAILDEMANDE.NOTOURNEE", "TOURNEE.NOTOURNEE")
                .leftJoin("DEMANDE", "DETAILDEMANDE.NODEMANDE", "DEMANDE.NODEMANDE")
                .where("TYPEDECHET.NOTYPEDECHET", id)
                .whereBetween("TOURNEE.DATETOURNEE", [dateFrom, dateTo])
                .groupBy('TYPEDECHET.NOMTYPEDECHET',"TYPEDECHET.NOTYPEDECHET")



    } catch (e) {
        console.error(e)
    }
}




module.exports = {
    getSumByTypeDechet,
    getSumForOneTypeDechet,
    getSumTypeDechetForOneSite,
    getAllTypeDechet
}