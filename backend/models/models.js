const mongoose=require('mongoose')
const itemSchema=mongoose.Schema({
    item_name:{
        type:String,
    },
    cost:{
        type:String,
    },
    delivery_time:{
        type:String,
    },
    image:[{type:Buffer}],
    availability:{
        type:String,
    },
    category:{
        type:String,
    },
    type:{
        type:String,
    }
})
const cartitemSchema=mongoose.Schema({
    itemId:{type:String},
    qty:{type:String}
})
const yourorderSchema=mongoose.Schema({
    itemId:{type:String},
    qty:{type:String}
})
const userSchema=mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        unique:true
    },
    admin:{
        type:String,
        required:true
    },
    mobile:{
        type:String
    },
    address:{
        type:String
    },
    cart_items:[{type:cartitemSchema,default:[]}],
    your_orders:[{type:yourorderSchema,default:[]}]

})
const ordersSchema=mongoose.Schema({
    itemId:{type:String},
    userId:{type:String},
    qty:{type:String}
})
const adminSchema=mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        unique:true
    },
    admin:{
        type:String,
        required:true
    },
    items:{type:[itemSchema],default:[]},
    orders:[{type:ordersSchema,default:[]}]
})

const item_model=mongoose.model('itemmodel',itemSchema)
const adminmodel=mongoose.model('adminmodel',adminSchema)
const usermodel=mongoose.model('usermodel',userSchema)
module.exports={item_model, adminmodel, usermodel}