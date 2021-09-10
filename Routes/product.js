const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const joi = require("joi");
const router = express.Router();
const {User,validateuser,hash}=require('../model/user');
const auth=require('../auth/auth');
const productschema=mongoose.Schema({

    name:{
        type:String,
        required:true,
        unique:true,
    },
    price:{
        type:Number,
        required:true,

    },
});
const Product=mongoose.model('Product',productschema);
async function checkadmin(id){
    const user1=await User.findById(id);
    if(user1.admin){
        return true;
    }
    return false;
}
router.get('/list', async (req, res) => {
    const prod = Product.find().sort('price');
    res.send(prod);
});

router.post('/create', auth,async (req, res) => {
    const { error } = validateproduct(req.body);
    if (error) return res.status(400).send(error.message);

    let product = new Product({ name: req.body.name , price: req.body.price});
    p1 = await product.save();

    res.send(p1);
});

router.put('/update/:uid',auth, async (req, res) => {
    if(!req.user.admin){
       return  res.status(404).send("Only Admins have this access!!")
    }
    if(!checkadmin(req.params.uid)){
        return res.status(403).send('Access Denied !');
    }
    const { error } = validateproduct(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const p1 = await Product.findByIdAndUpdate(req.params.id, { name: req.body.name , price: req.body.price});

    if (!p1) return res.status(404).send('The product with the given ID was not found.');

    res.send(p1).status(200);
});
router.delete('/delete/:uid', auth,async (req, res) => {
    if(!req.user.admin){
        return  res.status(404).send("Only Admins have this access!!")
    }
    if(!checkadmin(req.params.uid)){
        return res.status(403).send('Access Denied !');
    }
    const p1 = await Product.findByIdAndRemove(req.params.id);

    if (!p1) return res.status(404).send('The product with the given ID was not found.');

    res.send(p1).status(200);
});
router.get('/get/id/:id',auth, async (req, res) => {
    const p1 = await Product.findById(req.params.id);

    if (!p1) return res.status(404).send('The product with the given ID was not found.');

    res.send(p1).status(200);
});



function validateproduct(prod){          //First validation

    const schema=joi.object({

        name:joi.string().required().max(50),
        price:joi.number().required().min(0),

    })
    //  console.log(c);
    return schema.validate(prod);
}
module.exports = router;