const express = require('express')
const bodyParser= require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient

app.use(bodyParser.urlencoded({extended: true}))

app.set('view engine', 'ejs')

app.get('/', function (req, res) {
    db.collection('athletes').find().toArray(function(err, results) {
    	if (err) return console.log(err)
		res.render('index.ejs', {athletes: results})
	})
})

app.post('/athletes', function (req, res) {
	db.collection('athletes').save(req.body, function(err, result) {
		if (err) return console.log(err)
   		console.log('saved to database')
    		res.redirect('/')
	})
})

var db 

//MongoClient.connect('mongodb://endarice:er@ds157499.mlab.com:57499/ez_coach', function (err, database) {
	//if (err) return console.log(err)
	//db = database
	//app.listen(3000, function() {
		//console.log('listening on 3000')
	//})
//})

MongoClient.connect('mongodb://localhost:27017/ez_coach', function (err, database) {
	if (err) return console.log(err)
	db = database
	app.listen(3000, function() {
		console.log('listening on 3000')
	})
})