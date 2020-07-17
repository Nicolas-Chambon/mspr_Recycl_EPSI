async function authorize(request, _response, next) {
    const token = request.headers['usertoken'];

    if (!token){
        console.log(token)
        next()
    }
    else{
        // set user on-success
        request.user = await request.db.users.findByApiKey(token);

        // always continue to next middleware
        console.log("dans authorize : ",request.user)
        next();
    }

}

module.exports = authorize
