const express = require('express');
const bodyparser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const DB = require('./dbconnection');


const app = express();
var con = DB.conn;
//app.use(bodyparser.urlencoded({extended:true}));
app.use(express.urlencoded({ extended: true }));
app.set('view engine','ejs');

app.use(express.static('public'));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
  });
  
  const upload = multer({ storage });

app.get('/', function(req_get_user,res_get_user){

    res_get_user.render('users');

});

app.post('/',upload.single('file'), function(req_post_user,res_post_user){
    const { fname,lname,email,password} = req_post_user.body;
    if (!req_post_user.file) {
        return res_post_user.status(400).send('No file uploaded.');
      }
    const file = req_post_user.file;
    var sql_insert = `INSERT INTO signup_resume_data(First_name, Last_name, Email, Password, Resume) VALUES ('${fname}','${lname}','${email}','${password}','${file.path}')`;
    
        con.query(sql_insert, function (err, result) {
          if (err) {
              console.error(err);
              res_post_user.statusCode = 500;
              res_post_user.end('Error inserting file into database');
              return;
            }
  
            res_post_user.statusCode = 200;
            res_post_user.sendFile(__dirname +'/success.html');
        });

});

// app.get('/Admin', function(req_get_admin,res_get_admin){

//     const sql_name = `SELECT First_name FROM signup_resume_data`;
//     con.query(sql_name, (error, results, fields) => {
//         if (error) throw error;
//         if (results.length > 0) {
//             const values = results.map(row => Object.values(row));
//             res_get_admin.render('admin',{items:values});
//         } else {
//           res_get_admin.send('File not found!');
//         }
        
//       });


// });

// app.post('/Admin', function(req_post_admin,res_post_admin){
//     const f = req_post_admin.body.query;
//     let firstname = req_post_admin.body.query;
//     var sql_down = `SELECT Resume FROM signup_resume_data WHERE First_name = '${firstname}'`;
//     con.query(sql_down, (error, results, fields) => {
//          if (results.length > 0) {
//             if (error) throw error;
//             console.log(results);
//             const filePath = results[0].Resume;
//               const Path = filePath.slice(0, 7) + "/" + filePath.slice(7);
//               console.log(Path);
//               const file = path.join(__dirname, Path);
//               res_post_admin.download(file);
//          } else {
//            res_post_admin.send('File not found!');
//          }
//       });
// });










app.listen(process.env.PORT || 3000);