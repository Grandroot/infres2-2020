//Import the mongoose module
var mongoose = require('mongoose');
const  _ = require("underscore");
const  md5 = require("md5");

//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/my_database';
mongoose.connect(mongoDB, { useNewUrlParser: true });

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var identiteSite = mongoose.model('identiteSite', new mongoose.Schema({
    identifiant : String,
    mdp : String,
    urlSite : String,
    saltPwd : String,
    creator : String,

}));

var userData = mongoose.model('userData', new mongoose.Schema({
    identifiantUtilisateur : String,
    mdpUtilisateur : String,
    saltPwd : String,
}));

exports.addWebsiteIdentity = function addWebsiteIdentity(idUser, mdpUser, urlSite, saltPwd, varIdUserPrincipal) {
    if (idUser!=="" && mdpUser!=="" &&  urlSite!==""){
        var identite1 = new identiteSite({
            identifiant: idUser,
            mdp: mdpUser,
            urlSite : urlSite,
            saltPwd : saltPwd,
            creator : varIdUserPrincipal
        });
    }
    if (identite1!=null){
        identite1.save().then(() => {
            console.log("ajout identite created");
        });
    }
};


exports.getPwdFromUser = function getPwdFromUser(idUser, res, hashPwdSale, randomVal, method, urlLien) {
    userData.find({identifiantUtilisateur : idUser},{mdpUtilisateur : 1, _id:0}, function (err, users) {
        users=users.toString();
        users = users.substring(19, users.length - 3);
        var trucHache = md5(randomVal+users);

        if (hashPwdSale === trucHache){
            if (method==="requestPwd"){
                getWebsiteIdentity(idUser, urlLien, res);
            }
        }
        else{
            res.send(false);
        }
    });
};




function getWebsiteIdentity(idUser, site, res) {
    identiteSite.find({creator: idUser, urlSite : site},{mdp:1, identifiant:1, saltPwd:1, _id:0}, function (err, users) {
        res.send(users);
    });

};

exports.selectSaltFromUser = function selectSaltFromUser(idUser, res) {
    userData.find({identifiantUtilisateur : idUser},{saltPwd : 1, _id:0}, function (err, sel) {
        res.send([strRandom(10), sel]);
    });
};

exports.createUser = function createUser(idUser, mdpUser, saltPwd, varIdUserPrincipal) {
    if (idUser!=="" && mdpUser!=="" &&  saltPwd!==""){
        var identite1 = new userData({
            identifiantUtilisateur: idUser,
            mdpUtilisateur : mdpUser,
            saltPwd : saltPwd,
        });
    }
    if (identite1!=null){
        identite1.save().then(() => {
            console.log("utilisateur created");
        });
    }
};

function strRandom(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}