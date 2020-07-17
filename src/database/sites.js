const database = require('./database');

const getAllSites = async() => {
    try {
        return await
            database("SITES")
    } catch (e) {
        console.error(e)
    }
}

module.exports = {
    getAllSites
}