const database = require('../database/database');

const {getUserRight} = require('../database/utilisateurs');

function checkUserDb(request, res, next) {
    // grab authentication token from req header

    request.db = {
        users: {
            findByApiKey: async token => {
                let response = await getUserRight(token);


                console.log("dans le check : ", response)
                if (response.length === 0){
                    return {role : 'guest', id : 0}
                }
                else{
                    return {role : response[0].NOMFONCTION, id : response[0].NOFONCTION}
                }

            }
        }
    };

    next();
}



module.exports = checkUserDb