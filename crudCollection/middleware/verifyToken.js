require('dotenv').config;
const jwt = require('jsonwebtoken');

const User = require('./../models/user.js');

module.exports = async function verifyToken(req, res, next){
  const header = req.headers.authorization;
  if(!header){
    return res.status(401).json({
      error: true,
      message: "Access token is required"
    })
  }
  const token = header.split(" ")[1];
  try{
    const result = jwt.verify(token, process.env.JWTSECRET, {expiresIn: "1h"});
    
    let user = await User.findOne({
      token: token,
      email: result.email
    })
    if(!user){
      return res.status(403).json({
        error: true,
        message: "Authorization error"
      })
    }else{
      req.userData = await User.findOne({email: result.email});
      next();
    }
  }catch(err){
    console.log(err)
    return res.status(403).json({
      error: true,
      name: err.name
    })
  }
}
