require('dotenv').config;
const jwt = require('jsonwebtoken');

module.exports = async function generateToken(email){
  try{
    const payload = {email: email}
    const token = await jwt.sign(payload, process.env.JWTSECRET, {expiresIn: "1h"})
    return{
      error: false,
      token: token
    }
  }catch(error){
    console.log(error)
    return{
      error: true
    }
  }
}
