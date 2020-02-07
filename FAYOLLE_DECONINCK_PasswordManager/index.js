const express = require('express');
const app = express();
var MyMethods = require('./bd-connect.js');
var addWebsiteIdentity = MyMethods.addWebsiteIdentity;
var createUser = MyMethods.createUser;
var selectSaltFromUser = MyMethods.selectSaltFromUser;
var getPwdFromUser = MyMethods.getPwdFromUser;

app.get('/createUser', (req, res) => {
    var idUser = req.query.idUser;
    var mdpUserHashe = req.query.mdpUserHashe;
    var saltPwd = req.query.saltPwd;

    res.append('Access-Control-Allow-Origin', ['*']);
    createUser(idUser, mdpUserHashe, saltPwd);
    res.send(true);
});

app.get('/selectAllUsers', (req, res) => {
    selectAllUsers();
    res.send();
});



app.get('/authentificationUtilisateur', (req, res) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    var idUser = req.query.idUser;
    selectSaltFromUser(idUser, res);

});

app.get('/getAndCompareAuth', (req, res) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    var hashPwdSale = req.query.hashPwdSale;
    var idUser = req.query.idUser;
    var randVal = req.query.randVal;
    var method = req.query.method;
    var urlLien = req.query.urlLien;
    getPwdFromUser(idUser, res, hashPwdSale, randVal, method, urlLien);
});


app.get('/getWebsiteIdentity', (req, res) => {
    var idUtilisateur = req.query.idUtilisateur;
    var usrSelectionne = getWebsiteIdentity(idUtilisateur);
    res.send(usrSelectionne);
});

app.get('/selectAllFromDb', (req, res) => {
    selectAllFromDb();
    res.send();
});

app.get('/authUserAddWebsite', (req, res) => {
    var authentificatedUser=true;
    var idUserPrincipal = req.query.idUserPrincipal;
    if (authentificatedUser){
        var mdpUser = req.query.mdp;
        var identifiantUserSite = req.query.identifiantUserSite;
        var urlSite = req.query.urlSite;
        var saltPwd = req.query.saltPwd;
        res.append('Access-Control-Allow-Origin', ['*']);
        addWebsiteIdentity(identifiantUserSite, mdpUser,urlSite, saltPwd, idUserPrincipal);
        res.send(true); // identité site ajouté
    }
    else{
        res.send(false); // mauvaise authentification
    }
});

app.get('/authUserGetPassword', (req, res) => {
    var authentificatedUser=true;
    var idUser = req.query.idUser;

    if (authentificatedUser){
        var urlSite = req.query.urlSite;
        res.append('Access-Control-Allow-Origin', ['*']);
        getWebsiteIdentity(idUser, urlSite, res);
    }
    else{
        res.send(false); // mauvaise authentification
    }
});




app.use(express.static(__dirname + '/public'));
app.listen(4000,()=>{
    console.log("Server listening on port : 4000")
});