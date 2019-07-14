var express = require("express");
var bodyParser = require('body-parser');
let ejs = require('ejs');
var app = express();
var uniqid = require('uniqid');
const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const keys = "mysecret";


const url = 'mongodb://housekeeping:saty1234@ds213183.mlab.com:13183/housekeeping';
const dbName = 'housekeeping';


app.set("view engine", "ejs");
app.use(express.static(__dirname + '/views'));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


//routes

app.get('/admin/signup', (req, res) => {
    res.render("signup");
});

app.get('/admin/signin', (req, res) => {
    res.render("signin");
});

app.post('/admin/signup', (req, res) => {
    MongoClient.connect(url, function (err, client) {
        console.log("Connected successfully to server");
        const db = client.db(dbName);
        var data = {
            "id": uniqid(),
            "name": req.body.name,
            "email": req.body.email,
            "password": req.body.password
        }
        console.log(data);
        const collection = db.collection('admin');
        collection.find({
            'email': req.body.email
        }).toArray((err, result) => {
            if (result.length > 0) {
                return res.status(400).json({
                    message: 'email already exists'
                })
            } else {
                collection.insertOne(data, function (err, result) {
                    res.redirect('/admin/signin');
                })
            }
        })
    });


});

app.post('/admin/signin', (req, res) => {
    MongoClient.connect(url, function (err, client) {
        console.log("Connected successfully to server");
        const email = req.body.email;
        const password = req.body.password;
        const db = client.db(dbName);
        
        const collection = db.collection('admin');
        collection.find({'email': req.body.email}).toArray((err,result) => {
        if (result.length==0) {
            return res.status(404).json({
                email: 'email not found'
            });
        }
        else{
            if(result[0].password==password){
                res.render('index');
            }
            else{
                return res.status(404).json({
                   message: 'password is incorrect please try again'
                });
            }
        }
       
            })
        })
});

// router.get('/current', passport.authenticate('jwt', {
//     session: false
// }), (req, res) => {
//     res.send({
//         name: req.user.name,
//         email: req.user.email
//     });
// })





app.get('/', (req, res) => {
    res.render('dashboard');
});

app.get('/signin', (req, res) => {
    res.render('signin');
});


app.get('/add-asset', (req, res) => {
    res.render('addAsset');
});

app.post('/add-asset', (req, res) => {
    MongoClient.connect(url, function (err, client) {
        console.log("Connected successfully to server");
        const db = client.db(dbName);
        var data = {
            "id": uniqid(),
            "name": req.body.name,
            "description": req.body.description
        }
        console.log(data);
        const collection = db.collection('assets');

        collection.insertOne(data, function (err, result) {
            console.log("Inserted documents into the collection");
            // callback(result);
            res.render('index');
        });
    });

});

app.get('/add-task', (req, res) => {
    res.render('addTask');
})

app.post('/add-task', (req, res) => {
    MongoClient.connect(url, function (err, client) {
        console.log("Connected successfully to server");
        const db = client.db(dbName);
        var data = {
            "id": uniqid(),
            "name": req.body.name,
            "description": req.body.description
        }
        console.log(data);
        const collection = db.collection('tasks');
        collection.insertOne(data, function (err, result) {
            console.log("Inserted documents into the collection");
            // callback(result);
            res.render('index');
        });
    });

});


app.get('/add-worker', (req, res) => {
    res.render('addWorker');
})

app.post('/add-worker', (req, res) => {
    MongoClient.connect(url, function (err, client) {
        console.log("Connected successfully to server");
        const db = client.db(dbName);
        var data = {
            "id": uniqid(),
            "name": req.body.name,
            "description": req.body.description
        }
        console.log(data);
        const collection = db.collection('workers');

        collection.insertOne(data, function (err, result) {
            console.log("Inserted documents into the collection");
            // callback(result);
            res.render('index');
        });
    });
});

app.get('/assets/all', (req, res) => {
    MongoClient.connect(url, function (err, client) {
        console.log("Connected successfully to server");
        const db = client.db(dbName);
        const collection = db.collection('assets');
        collection.find().toArray(function (err, docs) {
            console.log("Found the following records");
            console.log(docs[0].id);
            res.render("assetPage", { docs });
        });
    });
});

app.get('/get-tasks-for-worker/:workerID', (req, res) => {
    const workerID = req.params.workerID;
    MongoClient.connect(url, function (err, client) {
        console.log("Connected successfully to server");
        const db = client.db(dbName);
        const collection = db.collection('workers');
        collection.find({ "id": workerID }).toArray(function (err, docs) {
            console.log("Found the following records");
            console.log(docs);
            res.render("workerView", { docs });
        });
    });
});

app.get('/allocate', (req, res) => {
    res.render('allocate');
})

app.get('/allocate-task', (req, res) => {
    MongoClient.connect(url, function (err, client) {
        console.log("Connected successfully to server");
        const db = client.db(dbName);
        const collection = db.collection('workers');
        collection.find({ "id": workerID }).toArray(function (err, docs) {
            console.log("Found the following records");
            console.log(docs);
            res.render("workerView", { docs });
        });
    });
});


app.listen(5000, () => {
    console.log("app on port 5000");
});