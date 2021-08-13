const validator = require('email-validator');
const User = require('./../models/user.js');
const bcrypt = require('bcrypt-nodejs');
const generateToken = require('./generateToken')
exports.Signup = async (req, res)=>{
  try{
    if(!req.body.confirmPassword || !req.body.email || !req.body.password){
      return res.status(400).json({
        error: true,
        message: 'confirmPassword field is required'
      })
    }
    else if(!validator.validate(req.body.email)){
      return res.status(400).json({
        error: true,
        message: "enter valid email"
      })
    }else{
      if(req.body.password == req.body.confirmPassword){
        const user = new User({
          email: req.body.email,
          password: req.body.password
        })
        let already = await User.findOne({email: req.body.email});
        if(already){
          return res.json({
            error: true,
            message: "Email already in use, please login"
          })
        }else{
          await user.save()
          return res.status(200).json({
            success: true,
            message: "Signup success",
          });
        }
      }else{
        return res.status(400).json({
          error: true,
          message: "Both the passwords should match."
        })
      }
    }
    }catch(err){
      console.log(err)
      return res.status(500).json({
        problem: err,
        error: true,
        message: "unable to signup"
      })
    }
  }

exports.Login = async (req, res)=>{
  try{
    if(!req.body.email || !req.body.password){
      return res.status(400).json({
        error: true,
        message: "Please provide both email and passwordd fields."
      })
    }else{
      const user = await User.findOne({email: req.body.email})
      if(!user){
        return res.status(404).json({
          error: true,
          message: "No account found with the specified email."
        })
      }
      bcrypt.compare(req.body.password, user.password, async (err, isMatch)=>{
        if(err){
          console.log(err)
        }
        if(!isMatch){
          return res.status(400).json({
            error: true,
            message: "Wrong password"
          })
        }else{
          const {error, token} = await generateToken(user.email)
          if(error){
            return res.status(500).json({
              error: true,
              message: 'please try again later.'
            })
          }
          user.token = token;
          await user.save();
          return res.status(200).json({
            success: true,
            message: "User loggedin successfully",
            token: token
          })
        }
      })

    }
  }catch(err){
    console.log(err)
    return res.status(500).json({
      problem: err,
      error: true,
      message: "unable to login"
    })
  }
}

exports.Hello = async (req, res)=>{
  return res.status(200).json(req.userData)
}
