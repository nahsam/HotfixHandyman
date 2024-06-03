const express = require('express');
   const app = express();

const bodyParser = require('body-parser');
const DataStore = require('nedb');
   const database = new DataStore('database.db');

const cors = require('cors')
const multer = require('multer');

const path = require('path');

const mysql = require('mysql2');

const pool = mysql.createPool({
   host: '127.0.0.1',
   user: 'root',
   password: '&BMDHNAq7rd&3t#Jqgfq',
   database: 'hotfixhandyman'

}).promise()


// ===============================================================================
database.loadDatabase();

var server = app.listen(5000, function () {
   console.log("Express App running at http://127.0.0.1:5000/");
})
// ===============================================================================




app.use(cors())
app.use(express.static('public'));
app.use(bodyParser.json());

const upload = multer({
    dest: 'uploads',
    fileFilter: (req, file, callback) => {
        console.log(file);
        if (!file.originalname.match(/\.(png|jpeg|jpg)$/)) {
            return callback(new Error('Please upload a Picture(PNG or JPEG)'))
        }
        else{
        callback(null, true);
         }
    }

})




app.post('/QuoteAPI',upload.single('photos'), (request, response) => {
   console.log(request.body);
   var data = {
               FirstName: request.body.FirstName,
               LastName: request.body.LastName,
               Address: request.body.Address,
               Email: request.body.Email,
               PhoneNumber: request.body.phonenumber,
               JobDescription: request.body.jobdescription,
               Images: request.file.originalname
            };
   console.log(request.body);
   console.log(data);
   insertinfo(data.FirstName, data.LastName, data.Address, 
               data.Email, data.PhoneNumber, data.JobDescription, data.Images);
   database.insert(data);
   console.log(request.body);
   console.log("after data insert");
   console.log("after doc");
   response.json({
      status: 'success',
      text: request.body
   });
});


async function insertinfo(FirstName, LastName, Address, Email, PhoneNumber, jobdescription, Images){
   const result = await pool.query(`
      INSERT INTO JobRequests (id, FirstName, LastName, Address, Email, PhoneNumber, jobdescription, 
                                 Images, Created)
      VALUES (null,?,?,?,?,?,?,?, CURRENT_TIMESTAMP())
      `, [FirstName, LastName, Address, Email, PhoneNumber, jobdescription, Images])
   return result
}