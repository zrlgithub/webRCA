const express = require('express');
const mysql = require('mysql')
const session = require('express-session');
const router = express.Router();
const path = require('path');
const alert = require('alert')
const bodyParser = require('body-parser')
const notifier = require('node-notifier');
//Routes
const UsersRoutes = require('./routes/users');
const { rootCertificates } = require('tls');

const app = express();

// parse application/json
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// Static files
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/assets', express.static(__dirname + 'public/assets'))
app.use('/assets-dashboard', express.static(__dirname + 'public/assets-dashboard'))
app.use('/scripts', express.static(__dirname + 'public/scripts'))

// Set Views
app.set('front-end', path.join(__dirname, 'front-end'))
app.set('view engine', "ejs")

  let data = {
    nume: undefined,
  }

  let data1 = {
    nume: undefined,
  }
  

// Routes
app.use("/users", UsersRoutes)


app.get('/', (req, res) => {
    res.render('index', {nume : data.nume,succes:''})
}) 

app.get('/about', (req, res) => {
    res.render('about', {nume : data.nume})
})

app.get('/products', (req, res) => {
    res.render('products', {nume : data.nume})
})

app.get('/login', (req, res) => {
    res.render('login',{succes:''})
})

app.get('/logout', (req, res) => {
  data = { nume: undefined }
  data1 = { nume: undefined }
  res.redirect('/')
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.get('/dashboard', (req, res) => {
    res.render('dashboard')
})

app.get('/contact', (req, res) => {
  res.render('contact', {nume : data.nume})
})

app.get('/tabel-clienti', function(req, res){
  connection.query('SELECT * FROM users', function(err1, result1) {

      if(err1){
          throw err1;
      } else {
        connection.query('SELECT * FROM comenzi', function(err2, result2) {

          if(err2){
              throw err2;
          } else {
              res.render('basic-table', {data:result1, data1: result2});   
              return;             
          }
      });
               
      } 
  });

});

app.get('/buy', (req, res) => {
  if(data.nume === undefined)
  {
    console.log("trebuie sa te loghezi");
    notifier.notify({
      title: 'Login!',
      message: 'Trebuie sa te loghezi!',
      icon: path.join(__dirname, 'icon.jpg'),
      sound: true,
      wait: true
    },
    function (err, response) {
      console.log(response);
  });
    res.redirect('login');
  }
  else
  {
    const nume = data.nume;
    connection.query(`SELECT * FROM users WHERE nume = '${nume}' `,function(err,row,fields){
    console.log(row[0].email);
    let email = row[0].email;
    let prenume = row[0].prenume;
    connection.query(`INSERT INTO comenzi (nume, prenume, email) VALUES ("${nume}","${prenume}","${email}")`, (err, rows, fields) => {})  
   return; 
  })
    res.render('index',{succes: `Un operator te va contacta in cel mai scurt timp pe adresa de email.`, nume: data.nume});
 
  }
})


//MY SQL CONNECTION

const connection = mysql.createPool({
  host: 'eu-cdbr-west-01.cleardb.com',
  user: 'bf852b744e428a',
  password: 'd3eb1890',
  database:'heroku_b688fc183b54ddd',
  port: 3306,
  multipleStatements: true
});

  
  app.post('/register',function(req,res){
    console.log("succesfully registration!")
    const {nume, prenume, email, parola} = req.body
    connection.query(`INSERT INTO users (nume, prenume, email, parola) VALUES ("${nume}","${prenume}","${email}","${parola}")`, (err, rows, fields) => {
        if(!err){
            res.render('login', {title: 'User Records', succes:'Registered successfully!'})
            return;
        }else{
            console.log(err)
        }
    })
  })

  app.post('/newsletter',function(req,res){
    console.log("succesfully newsletter registration!")
    const {nume, email} = req.body
    connection.query(`INSERT INTO newsletter (nume, email) VALUES ("${nume}","${email}")`, (err, rows, fields) => {
        if(!err){
            console.log(nume);
            res.render('index', {title: 'User Records', succes:'Te-ai abonat cu succes la newsletter!',nume: data.nume})
            return;
        }else{
            console.log(err)
        }
    })
  })

  app.post('/login', (req, res) => {
    const {email, parola} = req.body
    connection.query(`SELECT * FROM users WHERE email = '${email}' AND parola = '${parola}'`, function(err,row,fields){
      if(!err){
        if(row.length === 0)
        {
          notifier.notify({
            title: 'Credentiale incorecte!',
            message: 'Va rugam sa verificati cu atentie credentialele dvs!',
            icon: path.join(__dirname, 'icon.jpg'),
            sound: true,
            wait: true
          },
          function (err, response) {
            console.log(response);
          });
          console.log('Nu am gasit user');
          res.redirect('/login')
        }
        else
        {
          console.log(`Welcome ${row[0].nume}`)
        }
        if(row.length !== 0){
        //  res.locals.nume = row[0].nume !== 'Admin' && row[0].nume;
        //  res.locals.admin = row[0].nume === 'Admin' && row[0].nume;
        if(row[0].nume === 'Admin'){
          res.redirect('/dashboard')
        }else{
          data = {
            nume:row[0].nume
          }
          data1 = {
            nume:row[0].nume
          }
          notifier.notify({
            title: 'Buna ziua!',
            message: 'Te-ai conectat cu succes!',
            icon: path.join(__dirname, 'icon.jpg'),
            sound: true,
            wait: true
          },
          function (err, response) {
            console.log(response);
          }
          );
          res.redirect('/')
        }
      }
        return;
      }
      if(err){
        console.log(err)
      }
    }) 
  })


  app.post('/contact',function(req,res){
    console.log("message from contact!")
    const {nume, prenume, email, mesaj} = req.body
    connection.query(`INSERT INTO mesaje (nume, prenume, email, mesaj) VALUES ("${nume}","${prenume}","${email}","${mesaj}")`, (err, rows, fields) => {
        if(!err){
            //res.send(rows)
            console.log(mesaj);
            res.redirect('/contact');
            return;
        }else{
            console.log(err)
        }
    })
  })

const port = 5000

app.listen(port, console.log(`listening on port ${port}`));

