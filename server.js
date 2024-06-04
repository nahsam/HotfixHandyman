const express = require('express');
   const app = express();

const bodyParser = require('body-parser');
const DataStore = require('nedb');
   const database = new DataStore('database.db');

const cors = require('cors')
const multer = require('multer');


const path = require('path');

const mysql = require('mysql2');
const dotenv = require('dotenv');
   dotenv.config(); 

const pool = mysql.createPool({
   host: process.env.MYSQL_HOST,
   user: process.env.MYSQL_USER,
   password: process.env.MYSQL_PASSWORD,
   database: process.env.MYSQL_DB

}).promise()


// ===============================================================================
database.loadDatabase();

var server = app.listen(5000, function () {
   console.log("Express App running at http://127.0.0.1:5000/");
})
// ===============================================================================

var imageVault = [];
let date = Date.now();

app.use(cors())
app.use(express.static('public'));
app.use(bodyParser.json());

const storage = multer.diskStorage({
   
   destination: 'uploads',
   filename: (req,file, cb) =>{
      const imagename = req.body.Email + '-' + date
      imageVault.push(imagename+ '-' + file.originalname)
      cb(null,imagename+ '-' + file.originalname)
   },
});

const upload = multer({
      storage: storage,
      fileFilter: (req, file, callback) => {
           if (!file.originalname.match(/\.(png|jpeg|jpg)$/)) {
               return callback(new Error('Please upload a Picture(PNG or JPEG)'))
           }
           else{
           callback(null, true);
            }
      }


})




app.post('/QuoteAPI',upload.fields([{name:'photos', maxCount: 10},]), (request, response) => {
   var data = {
               FirstName: request.body.FirstName.replace(/[^a-zA-Z0-9-'\s]/g, ''),
               LastName: request.body.LastName.replace(/[^a-zA-Z0-9-'\s]/g, ''),
               Address: request.body.Address.replace(/[^a-zA-Z0-9.\s]/g, ''),
               Email: request.body.Email.replace(/[^a-zA-Z0-9@.\s]/g, ''),
               PhoneNumber: request.body.phonenumber.replace(/[^0-9\s]/g, ''),
               JobDescription: request.body.jobdescription,
               Images: imageVault // request.file.originalname
            };

   insertinfo(data.FirstName, data.LastName, data.Address, data.Email, data.PhoneNumber, data.JobDescription, 
               data.Images[0],data.Images[1],data.Images[2],data.Images[3],
               data.Images[4],data.Images[5],data.Images[6],data.Images[7],
               data.Images[9],data.Images[9]);
   database.insert(data);
   response.json({
      status: 'success',
      text: request.body
   });
});


async function insertinfo(FirstName, LastName, Address, Email, PhoneNumber, jobdescription, 
                           Image0, Image1, Image2,Image3, Image4, Image5, Image6, Image7, 
                           Image8, Image9){
   const result = await pool.query(`
      INSERT INTO JobRequests (id, FirstName, LastName, Address, Email, PhoneNumber, jobdescription,
                               Image0, Image1, Image2, Image3, Image4, Image5, Image6, Image7, 
                               Image8, Image9, Created)
      VALUES (null,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, CURRENT_TIMESTAMP())
      `, [FirstName, LastName, Address, Email, PhoneNumber, jobdescription, Image0, Image1, Image2,
            Image3, Image4, Image5, Image6, Image7, Image8, Image9]) 
   return result
}
