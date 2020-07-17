const database = require('./database');
const changeDates = require('../utilities/changeDates');




const assignDemandes = async() => {
  try {

    return await database.raw(`CALL ASSIGNTOURNEE()`)

  } catch (e) {
    console.error(e)
    return e
  }
}

const getAllDemandes = async() => {
  try {
    return await database
        .table("DEMANDE")
        // .leftJoin('DETAILDEMANDE', 'DEMANDE.NODEMANDE', 'DETAILDEMANDE.NODEMANDE')
        .leftJoin('ENTREPRISE', 'DEMANDE.SIRET', 'ENTREPRISE.SIRET')
        .leftJoin('SITES', 'DEMANDE.NOSITE', 'SITES.NOSITE')
        .select("*");
  } catch (e) {
    console.error(e);
    return null;
  }
}

const getAllDemandesNoSubmit = async() => {
  try {
    return await database
        .table("DEMANDE_NON_TRAITE")
  } catch (e) {
    console.error(e);
    return null;
  }
}

const getDemandeById = async(id) => {
  try {
    return await database
        .table("DEMANDE")
        // .leftJoin('DETAILDEMANDE', 'DEMANDE.NODEMANDE', 'DETAILDEMANDE.NODEMANDE')
        // .leftJoin('TYPEDECHET', 'DETAILDEMANDE.NOTYPEDECHET', 'TYPEDECHET.NOTYPEDECHET')
        .leftJoin('SITES', 'DEMANDE.NOSITE', 'SITES.NOSITE')
        .leftJoin('ENTREPRISE', 'DEMANDE.SIRET', 'ENTREPRISE.SIRET')
        .where("DEMANDE.NODEMANDE", id)
  } catch (e) {
    console.error(e)
  }
}


const addDemandeAuto = async(today, SIRET, NOSITE, DEVICE_ID) => {
  try {
    return await
        database("DEMANDE")
            .returning(["DATEDEMANDE", "SIRET", "NOSITE", "NOPOUBELLE","NODEMANDE"])
            .insert({
              DATEDEMANDE: today,
              SIRET: SIRET,
              NOSITE: NOSITE,
              NOPOUBELLE: DEVICE_ID
            })

  } catch (e) {
    console.error(e)
  }
}

// const getAllDemandesByDate = async(dateDemande) => {
//   try {
//     let entireDateDemande = new Date(dateDemande);
//   } catch (e) {
//     console.error(e);
//   }
// }

const getAllDemandesFromToDate = async(dateDemandeFrom, dateDemandeTo) => {
  try {
    let date = new Date(); //by default now
    let today = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    let entireDateDemandeFrom = new Date(dateDemandeFrom);
    let entireDateDemandeTo = changeDates.addDays(dateDemandeTo, 1); //+1 day for midnight 

    // 1 day
    if (!dateDemandeTo) {
      entireDateDemandeTo = changeDates.addDays(dateDemandeFrom, 1);
    }
    // From a day to an other day
    if (dateDemandeTo && dateDemandeTo != 'now') {
      entireDateDemandeTo = changeDates.addDays(dateDemandeTo, 1);
    }

    // From a day to today
    if (dateDemandeTo === 'now') {
      entireDateDemandeTo = changeDates.addDays(today, 1);
      // console.log(typeof(entireDateDemandeTo));
    }


    return await database.table("DEMANDE")
      .whereBetween("DATEDEMANDE", [entireDateDemandeFrom, entireDateDemandeTo])
  } catch (e) {
    console.error(e);
  }
}

// pour debug
// getAllDemandesFromToDate('2018-11-08', '2018-11-09')
//   .then((data) => {
//     if (!data || data.length === 0) {
//       console.log("empty");
//       return;
//     }
//     console.log(data);
//   })
//   .finally(() => {
//     database.destroy();
//   })
//   .catch(e => console.error(e));


// CHAMPS BDD
// {
//     NODEMANDE: 86,
//     DATEDEMANDE: 2018-11-09T22:00:00.000Z,
//     DATEENLEVEMENT: 2018-11-15T22:00:00.000Z,
//     WEB_O_N: 'N',
//     SIRET: 33364631300010,
//     NOPOUBELLE: null,
//     NOSITE: 1
// }


module.exports = {
  getAllDemandes,
  getDemandeById,
  getAllDemandesFromToDate,
  addDemandeAuto,
  getAllDemandesNoSubmit,
  assignDemandes
}