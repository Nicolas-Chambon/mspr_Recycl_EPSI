const database = require('./database');
const changeDates = require('../utilities/changeDates');


const getNbTourneeByEmployee = async() => {
    try {
        return await
            database("TOURNEE")
                .select("UTILISATEUR.NOM", "UTILISATEUR.PRENOM", "UTILISATEUR.NOEMPLOYE")
                .count("TOURNEE.NOEMPLOYE")
                .leftJoin("UTILISATEUR", "TOURNEE.NOEMPLOYE", "UTILISATEUR.NOEMPLOYE")
                .groupBy('UTILISATEUR.NOM', "UTILISATEUR.PRENOM", "UTILISATEUR.NOEMPLOYE")


    } catch (e) {
        console.error(e)
    }
}

const getTourneeByDate = async(date) => {

    try {
        return await
            database("TOURNEE")
                .where("DATETOURNEE",date)


    } catch (e) {
        console.error(e)
    }
}


const getPoidRestantTournee = async(id) => {
    try {
        return await
            database.raw(`SELECT CAPACITERESTANT(${id}) FROM DUAL`)


    } catch (e) {
        console.error(e)
    }
}




module.exports = {
    getNbTourneeByEmployee,
    getTourneeByDate,
    getPoidRestantTournee
}