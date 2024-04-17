const express=require('express')
const mongoose=require('mongoose')
const app = express();
const multer=require('multer');
const upload=multer()
const router=require('./routes/routes.js')
const cors=require('cors')
require('dotenv').config();
app.use(express.json())
app.use(cors())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
  });
app.use('/',router);
mongoose.connect(process.env.DB_URL)
app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})
module.exports=router