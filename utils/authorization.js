const jwt = require('jsonwebtoken')
const authorization = async(req, res, next) => {
    // recuperation du cookie Token
    const token = await req.cookies.Token;
    if (!token) {
        res.redirect('/')
    }
    try {
        const user = await jwt.verify(token, "SECRET-KEY")
        req.userId = user._id
        req.username = user.username
        next()

    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}

const checkUser = async(req, res, next) => {
    // recuperation du token
    const token = await req.cookies.Token;
    // verification du token
    if (token) {
        jwt.verify(token, "SECRET-KEY", async(err, decoded) => {
            if (err) {
                res.locals.user = null;
                next();
            } else {

                let user = await decoded
                res.locals.user = user;
                next()
            }
        })

    } else {
        res.locals.user = null;
        next()
    }
}

module.exports = { authorization, checkUser }