const isAdmin = (req,res,next) =>{
    const {role} = req.user
  if(role === 'admin'){ 
    next()
  }else{
    res.status(401).json({message: 'Not Authorized'})
  }
}

module.exports = isAdmin