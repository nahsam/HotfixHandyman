const express = require('express');
   const app = express();

const bodyParser = require('body-parser');
const DataStore = require('nedb');
   const database = new DataStore('database.db');

const cors = require('cors')
const multer = require('multer');

const path = require('path');

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
        callback(undefined, true);
         }
    }

})




app.post('/QuoteAPI',upload.single('photos'), (request, response) => {
   var data = {RefNum: null,
               FirstName: request.body.FirstName,
               LastName: request.body.LastName,
               Address: request.body.Address,
               Email: request.body.Email,
               PhoneNumber: request.body.PhoneNumber,
               JobDescription: request.body.jobdescription,
               Images: [request.file.originalname,request.file.originalname,request.file.originalname,request.file.originalname,request.file.originalname]
            };
   database.insert(data);
   console.log("after data insert");
   console.log("after doc");
   response.json({
      status: 'success',
      text: request.body
   });
});
