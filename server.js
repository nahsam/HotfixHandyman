// Initializations
// ===============================================================================
const dotenv = require('dotenv');
   dotenv.config();
// ===============================================================================
 const express = require('express');
   const app = express();
// ===============================================================================
const fs = require('fs');
// ===============================================================================
const bodyParser = require('body-parser');
// ===============================================================================
const DataStore = require('nedb');
   const database = new DataStore('database.db');
// ===============================================================================
const cors = require('cors')
// ===============================================================================
const multer = require('multer');
// ===============================================================================
const path = require('path');
// ===============================================================================
const nodemailer = require('nodemailer');
   var mailer = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
            user: 'hotfixhandyman@gmail.com',
            pass: process.env.EMAILPASS
      }
   });
// ===============================================================================
const mysql = require('mysql2');

   const pool = mysql.createPool({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB
   }).promise()
// ===============================================================================   
const {RecaptchaEnterpriseServiceClient} = require('@google-cloud/recaptcha-enterprise');
// ===============================================================================
//  Start Up
// ===============================================================================
database.loadDatabase();

var server = app.listen(5000, '0.0.0.0', function () {
   console.log("Express App running at http://0.0.0.0:5000/");
})
// ===============================================================================
// Body
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
               return callback(new Error('Please upload a Picture(PNG or JPEG)'))}
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
   sendemailnotification(data.FirstName, data.LastName, data.Address, data.Email, 
               data.JobDescription, imageVault);
   imageVault = [];
   response.json({
      status: 'success',
      text: request.body
   });
});
// ===============================================================================
// Functions
// ===============================================================================

/**
  * Create an assessment to analyze the risk of a UI action.
  *
  * projectID: Your Google Cloud Project ID.
  * recaptchaSiteKey: The reCAPTCHA key associated with the site/app
  * token: The generated token obtained from the client.
  * recaptchaAction: Action name corresponding to the token.
  */
async function createAssessment({
  // TODO: Replace the token and reCAPTCHA action variables before running the sample.
  projectID = "hotfixhandyman-1719508749922",
  recaptchaKey = "6LdH7gIqAAAAAD4upDqckZdMJyTFBRSjQpldySf-",
  token = "action-token",
  recaptchaAction = "action-name",
  }) {
  // Create the reCAPTCHA client.
  // TODO: Cache the client generation code (recommended) or call client.close() before exiting the method.
  const client = new RecaptchaEnterpriseServiceClient();
  const projectPath = client.projectPath(projectID);

  // Build the assessment request.
  const request = ({
    assessment: {
      event: {
        token: token,
        siteKey: recaptchaKey,
      },
    },
    parent: projectPath,
  });

  const [ response ] = await client.createAssessment(request);

  // Check if the token is valid.
  if (!response.tokenProperties.valid) {
    console.log(`The CreateAssessment call failed because the token was: ${response.tokenProperties.invalidReason}`);
    return null;
  }

  // Check if the expected action was executed.
  // The `action` property is set by user client in the grecaptcha.enterprise.execute() method.
  if (response.tokenProperties.action === recaptchaAction) {
    // Get the risk score and the reason(s).
    // For more information on interpreting the assessment, see:
    // https://cloud.google.com/recaptcha-enterprise/docs/interpret-assessment
    console.log(`The reCAPTCHA score is: ${response.riskAnalysis.score}`);
    response.riskAnalysis.reasons.forEach((reason) => {
      console.log(reason);
    });

    return response.riskAnalysis.score;
  } else {
    console.log("The action attribute in your reCAPTCHA tag does not match the action you are expecting to score");
    return null;
  }
}

async function insertinfo(FirstName, LastName, Address, Email, PhoneNumber, jobdescription,
                           Image0, Image1, Image2,Image3, Image4, Image5, Image6, Image7, 
                           Image8, Image9){
   const result = await pool.query(`
      INSERT INTO JobRequests (id, FirstName, LastName, Address, Email, PhoneNumber, jobdescription, jobStatus,
                               Image0, Image1, Image2, Image3, Image4, Image5, Image6, Image7, 
                               Image8, Image9, Created)
      VALUES (null,?,?,?,?,?,?,'New',?,?,?,?,?,?,?,?,?,?, CURRENT_TIMESTAMP());
      `, [FirstName, LastName, Address, Email, PhoneNumber, jobdescription, Image0, Image1, Image2,
            Image3, Image4, Image5, Image6, Image7, Image8, Image9]) 
   return result
}

async function sendemailnotification(FirstName, LastName, Address, Email, jobdescription,
                                       imageVault){
   var date = new Date();
   var numImages = attachmentVault.length;
   var attachmentVault = [];
   attachmentVault = imageVault.map(AttachmentMap);
   if (attachmentVault.length >= 4){
      const lengthdiff = attachmentVault.length  - 3;
      attachmentVault.length = 3;
      jobdescription = jobdescription + '\n \n' + lengthdiff + ' more images saved on server';
   }
   var mailOptions = {
         from: 'hotfixhandyman@gmail.com',
         to: 'hotfixhandyman@gmail.com',
         subject: FirstName + ' ' + LastName + Email + date, 
         text: jobdescription,
         attachments: attachmentVault
      };
   mailer.sendMail(mailOptions, function(error, info){
      if(error) console.log(error);
      else;
      });
   var mailOptions = {
         from: 'hotfixhandyman@gmail.com',
         to: Email,
         subject: "HotfixHandyman JobRequests Confirmation", 
         text: "Thank you for submitting a job request at Hotfixhandyman.com. Below is a summary of your submission. \n\nJobDescription: " + 
         jobdescription + "/n/n Number of Images: " + numImages
      };
   mailer.sendMail(mailOptions, function(error, info){
      if(error) console.log(error);
      else;
      });
}

 function AttachmentMap(value){
   return {filename: value , content: fs.createReadStream('/home/nathan/HotfixHandyman/uploads/' + value) };
};
