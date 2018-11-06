const crypto = require("crypto");
const fs = require('fs');
const path = require('path');

exports.testLogin = function(login) {
  if(login == undefined){
    return false;
  }
  if(login.username == undefined || login.password == undefined){
    return false;
  }
  return testLogin(login.username, login.password);
}

exports.newUser = function(login) {
  if(login == undefined){
    return false;
  }
  if(login.username == undefined || login.password == undefined){
    return false;
  }
  return newUser(login.username, login.password);
}

var config = {
    "saltBytes": 16,
    "hashCount": 100000,
    "hashBytes": 256,
    "algorithm": 'sha512',
    "saveLocation": path.join('./','/accounts/')
};

function hashPassword(password, salt, iterations) {
  var hash = crypto.pbkdf2Sync(password, salt, iterations, config.hashBytes, config.algorithm, (err, derivedKey) => {
    if (err) throw err;
    return derivedKey.toString('hex');
  });
  return hash.toString('hex');
}

function newUser(username, password) {
  var salt = crypto.randomBytes(config.saltBytes).toString('hex');
  var hash = hashPassword(password, salt, config.hashCount);

  var userData = {
    "hashCount": config.hashCount,
    "salt": salt,
    "hash": hash
  };

  fs.writeFile(config.saveLocation + username + '.json', JSON.stringify(userData), function(err){
    if(err){
      console.log(err);
    }
  });
}

function testLogin(username, password) {
  //If we dont have a usename or password then the login is incorect
  if(username == undefined || password == undefined){
    return false;
  }

  //If we dont have a file for this account then it is incorect
  var file = config['saveLocation'] + username + '.json'

  if(!fs.existsSync(file)) {
    return false;
  }

  var account = JSON.parse(fs.readFileSync(file, 'utf8'));

  //Return if it is the same as we have stored
  var test = hashPassword(password, account.salt, config.hashCount) == account.hash;
  return test;
}
