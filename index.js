const dotenv = require("dotenv")
const mongoose = require('mongoose');
const cors = require('cors');
//const multer = require('multer');
//const path = require('path');
const express = require("express");
const rentalRouter = require('./routes/rental.route.js')
const bodyParser = require('body-parser');
const userRouter = require('./routes/user.route.js')
const reviewRouter = require('./routes/review.route.js')
const typeRouter = require('./routes/typesRoute.js')

const jsonParser = bodyParser.json({limit:'20mb'})
dotenv.config();

const app = express();

app.use(jsonParser);

app.use(cors());

app.use(express.json());

app.use(express.static('public'));

mongoose.connect(process.env.MONGO_URI);
mongoose.connection
        .once("open",()=> console.log("Connected to database"))
        .on("error",(e)=> console.log(`Error:${e}`))

app.use("/api/rental",rentalRouter)
app.use("/api/auth",userRouter)
app.use("/api/review",reviewRouter)
app.use("/api/types",typeRouter)


app.listen(3001,() => {
    console.log("Server is running")
})


// const storage = multer.diskStorage({
//     destination:(req,file,cb) => {
//         cb(null,'public/Images')
//     },
//     filename:(req,file,cb) => {
//         cb(null,file.fieldname + "_" + Date.now() + path.extname(file.originalname))
//     }
// })


// const upload = multer ({
//     storage:storage
// })

// app.post('/upload',upload.single('file'),(req,res) => {
//     User.create({image:req.file.filename})
//     .then(result => res.json(result))
//     .catch(err => console.log(err))
// })
// app.get('/getImage', (req,res) => {
//     User.find()
//     .then(users => res.json(users))
//     .catch(err => res.json(err))
// })


