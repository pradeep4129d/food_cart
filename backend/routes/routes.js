const mongoose=require('mongoose')
const router=require('express').Router()
const {item_model,adminmodel,usermodel}=require('../models/models.js')
const multer = require('multer');
const upload = multer();
const jwt=require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token)
        return res.status(403).send({ login: false, message: 'No token provided.' });
    jwt.verify(token, 'FoodCart', (err, decoded) => {
    if (err)
        return res.status(500).send({ login: false, message: 'Failed to authenticate token.' });
    req.userId = decoded.id;
    next();
    });
};
router.post('/getuserdata',async(req,res)=>{
    try {
        const user=await usermodel.findOne({_id:req.body.userid})
        if(!user) return res.status(404).send({ success: false, msg:'user not found'});
        return res.status(200).send({success:true,data:user})
    } catch (error) {
        res.status(404).send({success:false,msg:error.message})
    }
})
router.delete('/deleteadminorder',verifyToken,async(req,res)=>{
    try {
        console.log(req.body.id)
        const user= await usermodel.findOne({your_orders:{$elemMatch:{itemId:req.body.id}}})
        const userindex=user.your_orders.findIndex(item=>item.itemId===req.body.id)
        user.your_orders.splice(userindex,1);
        await user.save()
        const admin=await adminmodel.findOne({_id:req.userId})
        if(!admin)
        return res.status(403).send({success:false,msg:'admin not found'})
        const index=admin.orders.findIndex(item=>item.itemId===req.body.id)
        if(index===-1){
            return res.status(401).send({success:false,msg:'item not found'})
        }
        admin.orders.splice(index,1);
        await admin.save();
        return res.status(200).send({success:true,msg:'deleted successfully'})
    } catch (error) {
        res.status(404).send({success:false,msg:error.message})
    }
})
router.put('/updateUser',verifyToken,async(req,res)=>{
    try {
        const {mobile,address}=req.body
        const user=await usermodel.findOneAndUpdate(
            {_id:req.userId},
            {$set:{mobile,address}},
            {new:true})
        if(!user)
        return res.status(401).send({success:false,msg:'user not found'})
    else
    return res.status(200).send({success:true,msg:'updated successfully'})
    } catch (error) {
        res.status(404).send({success:false,msg:error.message});
    }
})
router.get('/getOrders',verifyToken,async(req,res)=>{
    try {
        const userdata=await usermodel.findOne({_id:req.userId})
        if(!userdata){
            return res.status(401).send({success:false,msg:'Not found'})}
        else
        return res.status(201).send({success:true,data:userdata.your_orders})

    } catch (error) {
        res.status(404).send({success:false,msg:error.message})
    }
})
router.delete('/removeCart',verifyToken,async(req,res)=>{
    const userdata=await usermodel.findOne({_id:req.userId});
    const itemId=req.body
    if(!userdata)
    return res.status(404).send({success:false,msg:'user not found'})
                                console.log(userdata.cart_items)
    const itemIndex = userdata.cart_items.findIndex(item => item.itemId == itemId.id);
    if (itemIndex === -1){
        return res.status(404).json({error:'Item not found'});
    }
    userdata.cart_items.splice(itemIndex, 1);
    await userdata.save();
    res.status(200).json({success:true, msg:'Item deleted successfully'});
})

router.put('/placeOrder',verifyToken,async(req, res)=>{
    const item=req.body.userdata;
    const order={itemId:req.body.userdata.itemId,qty:req.body.userdata.qty,userId:req.body.userId}
    console.log(order)
    const adminId=req.body.adminId
    try {
        const updatedadmin=await adminmodel.findOneAndUpdate(
            {_id:adminId},
            {$push:{orders:order}},
            {new:true}
            )
            console.log(updatedadmin)
        const updatedUser=await usermodel.findOneAndUpdate(
            {_id:req.userId},
            {  $push: { your_orders:item} },
            { new: true }
            )
        if(!updatedUser)
        return res.status(403).send({success:false})
        else
        return res.status(201).send({success:true})
    } catch (error) {
        res.status(500).send({success:false,msg:error.message})
    }
})
router.post('/getitemname',async(req,res)=>{
    try {
        const id=req.body.id
        const item=await adminmodel.findOne({'items': {$elemMatch: {_id: id}}})
        if(item){const index=item.items.findIndex(item=>item._id==id)
            const data={adminId:item._id,itemData:item.items[index].item_name}
            res.status(200).send({success:true,data:data})
        }
        else
        res.status(404).send({success:false,msg: "Item not found"});  
    } catch (error) {
        res.status(400).send({success:false,msg:error.message})
    }
})
router.post('/getitem',async(req,res)=>{
    try {
        const id=req.body.id
        const item=await adminmodel.findOne({'items': {$elemMatch: {_id: id}}})
        if(item){const index=item.items.findIndex(item=>item._id==id)
            const data={adminId:item._id,itemData:item.items[index]}
            res.status(200).send({success:true,data:data})
        }
        else
        res.status(404).send({success:false,msg: "Item not found"});
        
    } catch (error) {
        res.status(400).send({success:false,msg:error.message})
    }
})
router.put('/addTocart',verifyToken,async(req,res)=>{
    const item=req.body;
    try {
        const updatedUser=await usermodel.findOneAndUpdate(
            {_id:req.userId},
            {  $push: { cart_items:item} },
            { new: true }
            )
        if(!updatedUser)
        return res.status(403).send({success:false})
        else
        return res.status(201).send({success:true})
    } catch (error) {
        res.status(500).send({success:false,msg:error.message})
    }
})
router.delete('/deleteproduct',verifyToken, async(req, res) => {
    const admindata=await adminmodel.findOne({_id:req.userId});
    const itemId=req.body.Id
    if(!admindata)
    return res.status(404).send({success:false,msg:'admin not found'})
    const itemIndex = admindata.items.findIndex(item => item._id == itemId);
    if (itemIndex === -1){
        return res.status(404).json({error:'Item not found'});
    }
    admindata.items.splice(itemIndex, 1);
    await admindata.save();
    res.status(200).json({success:true, msg:'Item deleted successfully'});
})
router.get('/getuser',verifyToken,async (req, res) => {
    try {
        const userdata=await usermodel.findOne({_id:req.userId});
        res.status(200).send({success:true,data:userdata})
    } catch (error) {
        res.status(404).send({success:false,error:error.message});
    }
})
router.get('/getadmin',verifyToken,async (req, res) => {
    try {
        const admindata=await adminmodel.findOne({_id:req.userId})
        res.status(200).send({success:true,data:admindata})
    } catch (error) {
        res.status(404).send({success:false,msg:error.message})
    }
})
router.get('/getproduct',async (req, res) => {
    try {
        const data=await adminmodel.find({})
        res.status(200).send({success:true,data:data})
    } catch (error) {
        res.status(404).send({success:false,error:error.message});
    }
})
router.put('/add', upload.any(),verifyToken, async(req, res) => {
    try {
        const {item_name,category,cost,type,availability,delivery_time}=JSON.parse(req.body.details)
        const image=req.files[0].buffer
        const updatedadmin= await adminmodel.findOneAndUpdate(
            { _id:req.userId },
            {  $push: { items:{item_name,cost,delivery_time,image,availability,category,type}} },
            { new: true }
        );
        if (!updatedadmin) {
            return res.status(404).json({ error: 'Admin not found' });
        }
        res.status(200).json({ success: true});
    } catch (error) {
        res.status(400).send({success:false,msg:error.message})
    }
});
router.post('/signup',async(req,res)=>{
    const {username,password,admin,mobile,address}=req.body
    if(admin==='true')
    {
        try {
            const admin_model=new adminmodel({username,password,admin})
            await admin_model.save()
            const admindata=await adminmodel.findOne({username,password,admin})
            console.log(admindata);
            const token=jwt.sign({id:admindata._id},'FoodCart',{expiresIn:3600})
            res.status(200).send({msg:true,admin:true,data:{token:token}})
        } catch (error) {
            res.status(200).send({msg:false})
        }
    }
    else{
        try {
            const user_model=new usermodel({username,password,admin,mobile,address})
            await user_model.save()
            const userdata=await usermodel.findOne({username,password,admin})
            const token=jwt.sign({id:userdata._id},'FoodCart',{expiresIn:3600})
            res.status(200).send({msg:true,admin:false,data:{token:token}})
        } catch (error) {
            res.status(200).send({msg:false})
        }
    }
})
router.post('/login',async(req,res)=>{
    const {username,password,admin}=req.body;
    if(admin==="false"){
        try {
            const  userdata=await usermodel.findOne({username, password});
            console.log(userdata);
            if (userdata){
                const token=jwt.sign({id:userdata._id},'FoodCart',{expiresIn:3600})
                res.status(200).send({msg:true,admin:false,data:{token:token,data:userdata}})
            }
            else{
                res.status(200).send({msg:false})
            }
        } catch (error) {
            res.status(404).send(error)
        }
    }
    else{
        try {
            const  admindata=await adminmodel.findOne({username, password});
            if (admindata){
                const token=jwt.sign({id:admindata._id},'FoodCart',{expiresIn:3600})
                res.status(200).send({msg:true,admin:true,data:{token:token,data:admindata}})
            }
            else{
                res.status(200).send({msg:false})
            }
        } catch (error) {
            res.status(404).send(error)
        }
    }
})
module.exports=router