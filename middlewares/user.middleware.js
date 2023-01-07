const isAdmin = (req,res,next) =>{
    const {role} = req.user
  if(role === 'Admin'){ 
    next()
  }else {
    res.redirect('/login')
  }
}

module.exports = isAdmin