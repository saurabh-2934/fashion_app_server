const jwt = require('jsonwebtoken')
require('dotenv').config()

const authorize = (request, response, next) => {
    let jwtToken

    const authHeader = request.headers['authorization']
    if (authHeader !== undefined) {
        jwtToken = authHeader.split(' ')[1]
    }

    if(jwtToken) {
        jwt.verify(jwtToken, process.env.MY_SECRET, async (error, paylod) => {
            if (error) {
                response.status(404).json({
                    error_msg: 'Invalid JSON token'
                })
            } else {
                request.id = paylod.id
                next()
            }
        })
    }else {
        response.status(404).json({
            error_msg: 'You are not authorize to do so.'
        })
    }
}

module.exports = authorize
