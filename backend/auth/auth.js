const jsonwebtoken = require("jsonwebtoken")

const authVerify = async (req,res,next) => {
    try {
        const header = req.headers.authorization
        if (header == null) {
            return res.status(402).json({
                success: false,
                message: "tokennya mana yang mulia",
            })
        }

        let token = header.split(" ")[1]
        const SECRET_KEY = "secretcode"

        let decodedToken
        try {
            decodedToken = await jsonwebtoken.verify(token, SECRET_KEY)
        } catch (error) {
            if (error instanceof jsonwebtoken.TokenExpiredError) {
                return res.status(401).json({
                    message: "token kadaluarsa yang mulia",
                   
                })
            }
            return res.status(401).json({
                message: "tokennya gabisa yang mulia",
               
            })
        }

        req.userData = decodedToken
        next()
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "internal server error yang mulia",
            message: error.message
        })
    }
}

module.exports = {authVerify}