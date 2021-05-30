const express = require('express');
const Router = express.Router()


Router.get('/', (req, res) => {
    connection.query("SELECT * from users", (err, rows, fields) => {
        if(!err){
            res.send(rows)
        }else{
            console.log(err)
        }
    })
})

Router.get('/tabel-clienti', function(req, res){

    connection.query('SELECT * FROM users', function(err, result) {

        if(err){
            throw err;
        } else {
            console.log(result);
            res.render('basic-table', {data: result});   
            return;             
        }
        
    });
    connection.query('SELECT * FROM comenzi', function(err, result) {

        if(err){
            throw err;
        } else {
            res.render('basic-table', {data1: result});   
            return;             
        }
    });

});

// Router.post('/register', (req, res) => {
//     const {nume, prenume, email, parola} = req.body
//     connection.query(`INSERT INTO users (nume, prenume, email, password) VALUES (${nume},${prenume},${email},${parola})`, (err, rows, fields) => {
//         if(!err){
//             res.send(rows)
//         }else{
//             console.log(err)
//         }
//     })
// })

// Router.get('/register', (req, res) => {
//         if(!err){
//             res.log("Succesfully conn!")
//         }else{
//             console.log(err)
//         }
// })

module.exports = Router;