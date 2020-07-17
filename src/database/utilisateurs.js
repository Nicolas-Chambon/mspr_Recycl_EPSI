const database = require('./database');
//Todo to replace by utilisateur pour rRecycl
const getAllUsers = async() => {
  try {
    return await database.table("UTILISATEUR").select("*");
  } catch (e) {
    console.error(e);
    return null;
  }
}

const getUsersById = async(id) => {
  try {
    return await database.table("UTILISATEUR").where("NOEMPLOYE", id)
  } catch (e) {
    console.error(e)
  }
}

const getAllUsersBySite = async(id) => {
  try {
    return await database.table("UTILISATEUR").where("NOSITE", id)
  } catch (e) {
    console.error(e)
  }
}

const getUserRight = async(token) => {
  try {
    return await  database("UTILISATEUR")
        .select('FONCTION.NOMFONCTION', 'FONCTION.NOFONCTION')
        .where("TOKEN", "=", token)
        .leftJoin("FONCTION", "UTILISATEUR.NOFONCTION", "FONCTION.NOFONCTION")
  } catch (e) {
    console.error(e)
  }
}

// pour debug
// getAllUsersById(7)
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

module.exports = {
  getAllUsers,
  getUsersById,
  getAllUsersBySite,
  getUserRight
}