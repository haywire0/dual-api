const User = require('./../models/user');
const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({}, {strict: false});
//getAll
exports.getAll = async (req, res)=>{
  try{
    const Collection = mongoose.model(req.params.collection, dataSchema, req.params.collection);
    const collection = await Collection.find()
    return res.status(200).json(collection)
  }catch(err){
    console.log(err)
    return res.status(500).json({
      error: true
    })
  }
}

//getOne
exports.getOne = async (req, res)=>{
  try{
    const Collection = mongoose.model(req.params.collection, dataSchema, req.params.collection);
    const collection = await Collection.findOne({_id: req.params.objectId})
    if(collection){
      return res.status(200).json(collection)
    }else{
      return res.status(400).json({
        message: 'No data with that provided objectId in ' + req.params.collection
      })
    }
  }catch(err){
    console.log(err)
    return res.status(400).json({
      error: true,
      message: err.message
    })
  }
}

//create
exports.create = async (req, res)=>{
  try{
    const Collection = mongoose.model(req.params.collection, dataSchema, req.params.collection);
    const collection = new Collection(req.body)
    collection.save()
    return res.status(201).json({
      message: 'Data created successfully'
    })

  }catch(err){
    console.log(err)
    return res.status(500).json({
      error: true
    })
  }
}

//put
exports.put = async (req, res)=>{
  try{
    const Collection = mongoose.model(req.params.collection, dataSchema, req.params.collection);
    const collection = await Collection.findOne({_id: req.params.objectId})
    if(collection){
      const update = await Collection.updateOne(
        {_id: req.params.objectId},
        {$set: req.body},
        {owerwrite: true}
      )
      .then(()=>{
        return res.status(200).json({
          message: "updated successfully"
        })
      })
      .catch((err)=>{
        return res.status(500).json({
          error: true,
          message: "update failed"
        })
      })
      }else{
        return res.status(400).json({
          error: true,
          message: "No data found with that provided objectId in "+ req.params.collection
        })
      }
    }catch(err){
    console.log(err)
    return res.status(500).json({
      error: true,
      message: "update failed"
    })
  }
}

//patch
exports.patch = async (req, res)=>{
  try{
    const Collection = mongoose.model(req.params.collection, dataSchema, req.params.collection);
    const collection = await Collection.findOne({_id: req.params.objectId})
    if(collection){
      const update = await Collection.updateOne(
        {_id: req.params.objectId},
        {$set: req.body},
      )
      .then(()=>{
        return res.status(200).json({
          message: "updated successfully"
        })
      })
      .catch((err)=>{
        return res.status(500).json({
          error: true,
          message: "update failed"
        })
      })
      }else{
        return res.status(400).json({
          error: true,
          message: "No data found with that provided objectId in "+ req.params.collection
        })
      }
    }catch(err){
    console.log(err)
    return res.status(500).json({
      error: true,
      message: "update failed"
    })
  }
}

//delete all
exports.deleteAll = async (req, res)=>{
  try{
    const Collection = mongoose.model(req.params.collection, dataSchema, req.params.collection);
    const del = await Collection.deleteMany();
    return res.status(200).json({
      message: "All rows deleted in " + req.params.collection
    })
  }catch(err){
    console.log(err)
    return res.status(500).json({
      error: true,
      message: "deletion failed"
    })
  }
}

//delete one
exports.deleteOne = async (req, res)=>{
  try{
    const Collection = mongoose.model(req.params.collection, dataSchema, req.params.collection);
    const collection = await Collection.findOne({_id: req.params.objectId})
    if(collection){
      const del = await Collection.deleteOne({_id: req.params.objectId})
      .then(()=>{
        return res.status(200).json({
          message: "deleted successfully"
        })
      })
      .catch((err)=>{
        return res.status(500).json({
          error: true,
          message: "deletion failed"
        })
      })
      }else{
        return res.status(400).json({
          error: true,
          message: "No data found with that provided objectId in "+ req.params.collection
        })
      }
    }catch(err){
    console.log(err)
    return res.status(500).json({
      error: true,
      message: "deletion failed"
    })
  }
}
