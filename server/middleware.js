const jwt = require("jsonwebtoken")
function authenticateToken(req, res, next) {

    let secretkey = "EComHub"
    const token = req.header("Authorization");
    console.log(token)
    if (token == "null") {
        console.log("there is error")
        return res.sendStatus(401)
    }
    else {
         jwt.verify(token, secretkey, (err, user) => {
        if (err) {
            return res.sendStatus(403)
        };
        console.log(user)
        req.user = user
        next();
    });
    }
}

module.exports = {authenticateToken}