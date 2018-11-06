console.log("Starting Server");
//importing things

//All express things
const express = require('express');
const app = express();
//All things for managing server types
const https = require('https');
const http = require('http');
//File Handling
const path = require('path');
const fs = require('./src/fs-promise.js');
const bodyParser = require('body-parser')
const mv = require('mv');
//Connection managing
const formidable = require('formidable');
const session = require('client-sessions');
//Login Data
const loginHandler = require('./src/loginHandler.js');

//Config
const ports = {
	https: 443,
	http: 8080
};
const httpsOpts = {
	cert: fs.fs.readFileSync('./ssl/certificate.crt', 'utf8'),
	key: fs.fs.readFileSync('./ssl/privateKey.key', 'utf8')
}
const sesionOpts = {
  cookieName: 'session',
  secret: 'JgEpkcEY4O0sYld7tXrxnGjA6QCQcrymNhqxm8ddvir2Jgxl163zluvPIQrnNZWtY24Tw0ZprrQfW92Zwjn5NfiOlYnyb6hZVYAHBbYJKOV8W6nA5MoYjyNmLPap587xzpP3VBtZSzbYfGwNvTcSug0MpJV4vVcABvQg2WOyQHkndFJDNgvNQFcfCG2COVGFfkV0ofgE6SWFAayTS359Gp19qFxOilUaBdiUYdbrcjR95CErwqCPHdFIhqP6P6ou19nUc6h3CGRmTiKOkRveLqo9MRn3x6nZ3oA5m4sXUcND',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000
}

//All express add ons
const publicDir = path.join(__dirname,'/public/');
app.use(express.static(publicDir));

app.use(session(sesionOpts));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

//Server for http
var httpServer = http.createServer(app);
httpServer.listen(ports['http'], function(){
	console.log("Running http server on port: " + ports['http']);
});

//Server for https
var httpsServer = https.createServer(httpsOpts, app);
//Starting servers
httpsServer.listen(ports['https'], function(){
	console.log("Running https server on port: " + ports['https']);
});


//page requests
//at root path open html homepage
app.get('/', function (req, res) {
    res.header('Content-type', 'text/html');
    res.sendFile(path.join(publicDir, '/html/', '/pages/', 'home.html'));
});

app.get('/admin', function(req, res){
	if(loginHandler.testLogin(req.session.login)){
    res.header('Content-type', 'text/html');
    res.sendFile(path.join(publicDir, '/html/', '/pages/', 'admin.html'));
	}
	else{
    res.header('Content-type', 'text/html');
    res.sendFile(path.join(publicDir, '/html/', '/pages/', 'login.html'));
	}
});

//at /partners open partners page
app.get('/partners', function (req, res) {
    res.header('Content-type', 'text/html');
    res.sendFile(path.join(publicDir, '/html/', '/pages/', 'partners.html'));
});

//at /subteams ope  about Subteams page
app.get('/subteams', function(req, res) {
    res.header('Content-type', 'text/html');
    res.sendFile(path.join(publicDir, '/html/', '/pages/', 'subTeams.html'));
});

//at /aboutUs open about us page
app.get('/aboutUs', function(req, res) {
    res.header('Content-type', 'text/html');
    res.sendFile(path.join(publicDir, '/html/', '/pages/', 'aboutUs.html'));
});

//at /tournamentHistory open about us page
app.get('/tournamentHistory', function(req, res) {
    res.header('Content-type', 'text/html');
    res.sendFile(path.join(publicDir, '/html/', '/pages/', 'tournamentHistory.html'));
});

//at /MeetTheTeam open fast facts page
app.get('/MeetTheTeam', function(req, res) {
    res.header('Content-type', 'text/html');
    res.sendFile(path.join(publicDir, '/html/', '/pages/', 'meetTheTeam.html'));
});

//at /Chairmans open I want a robot to page
app.get('/Chairmans', function(req, res) {
    res.header('Content-type', 'text/html');
    res.sendFile(path.join(publicDir, '/html/', '/pages/', 'chairmans.html'));
});

//at /UpcomingEvents open I want a robot to page
app.get('/UpcomingEvents', function(req, res) {
    res.header('Content-type', 'text/html');
    res.sendFile(path.join(publicDir, '/html/', '/pages/', 'upcomingEvents.html'));
});

//at /impact open impact page
app.get('/impact', function(req, res) {
    res.header('Content-type', 'text/html');
    res.sendFile(path.join(publicDir, '/html/', '/pages/', 'impact.html'));
});

//at /mura open mura page
app.get('/mura', function(req, res) {
    res.header('Content-type', 'text/html');
    res.sendFile(path.join(publicDir, '/html/', '/pages/', 'mura.html'));
});

//if path isnt found redirect user to root
app.get('*',function (req, res) {
	res.redirect('/');
});

//post requests
app.post('/login', function(req, res) {
	res.setHeader('Content-Type', 'application/json');
	var login = req.body;

	loginTest = loginHandler.testLogin(login);

	if(loginTest){
		req.session.login = login;
	}

	res.send({loginValue: loginTest});
});

app.post('/logout', function(req, res) {
	res.setHeader('Content-Type', 'application/json');
	delete req.session.login;
	res.send();
});

app.post('/getPageData', function(req, res){
	res.setHeader('Content-Type', 'application/json');
	var page = req.body.page;

	//Sanitize the input
	page = page.replace(/..\//gm,'');
	//get the file path that we need
	page = path.join(path.join(publicDir, '/json/'),page);

	//read the file we want
	fs.readFile(page, 'utf8')
	.then((data) => {
		//Send the json file
		res.send(JSON.parse(data));
	})
	.catch((err) => {
		//If we have an error tell people about it
		console.log(err);
		res.send(JSON.parse({err: err}));
	})
});

app.post('/setPageData', function(req, res){
	res.setHeader('Content-Type', 'application/json');

	//Make sure the user is logged in as an admin
	var login = req.session.login;
	loginTest = loginHandler.testLogin(login);

	//If we this isnt a admin then dont do anything
	if(!loginTest){
		res.send();
		return;
	}

	var page = req.body.page;
	//get the file path that we need
	page = path.join(publicDir, '/json/', page + '.json');

	//get the data that we want to save ready
	var data = req.body.data;
	data = JSON.stringify(data);

	//read the file we want
	fs.writeFile(page, data)
	.then(() => {
		res.send("{}");
	})
	.catch((err) => {
		if(err){
			//If we have an error tell people about it
			console.log(err);
			res.send(JSON.parse({err: err}));
		}
	});
});

app.post('/getPages', function(req, res){
	res.setHeader('Content-Type', 'application/json');

	//Make sure the user is logged in as an admin
	var login = req.session.login;
	loginTest = loginHandler.testLogin(login);

	//If we this isnt a admin then dont do anything
	if(!loginTest){
		res.send();
		return;
	}

	//Get a list of all files in the html folder
	fs.walk(path.join(publicDir, '/json/'))
	.then((files) => {
		//Remove the .html from the files
		files = files.map((x) => x.split('.')[0]);
		res.send(JSON.stringify({pages: files}));
	})
});
