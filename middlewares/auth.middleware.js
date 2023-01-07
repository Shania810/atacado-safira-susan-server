const jwt = require('jsonwebtoken')
const auth = (req,res,next) =>{
    const token = req.get('Authorization')
    if(!token){
      res.status(401).json({message: 'Request without token'})
      return
    }
    const tokenWithoutBearer = token.split(' ')[1]
    try {
        const decodedToken = jwt.verify(tokenWithoutBearer,process.env.JWT_SECRET)
        req.user = {...decodedToken}
        next()
    } catch (error) {
        res.status(401).json({message: error.message})
    }

}

module.exports = auth