function authentificationUtilisateur(method){

    var identifiantPM   = document.getElementById("identifiantPM").value;
    var mdpPM           = document.getElementById("mdpPM").value;
    var urlLien           = document.getElementById("siteName").value;
    var req = new XMLHttpRequest();
    req.open("get","http://localhost:4000/authentificationUtilisateur?idUser="+identifiantPM, true);
    req.send();
    req.onreadystatechange = function() {
        if (req.readyState == XMLHttpRequest.DONE) {
            if (req.responseText!==null){
                var splitResponse = req.responseText.split(",");
                sel=splitResponse[1].substring(13,splitResponse[1].length - 4);
                var splitHash = splitResponse[0].substring(2 , splitResponse[0].length -1);
                var hashCompare = md5(splitHash+md5(mdpPM+sel));
                var reqImbrique = new XMLHttpRequest();
                reqImbrique.open("get","http://localhost:4000/getAndCompareAuth?hashPwdSale="+ hashCompare+"&idUser="+identifiantPM+"&randVal="+splitHash+"&method="+method+"&urlLien="+urlLien, true);
                reqImbrique.send();
                reqImbrique.onreadystatechange = function() {
                    if (reqImbrique.readyState == XMLHttpRequest.DONE) {
                        var response = reqImbrique.responseText;
                        response=response.replace("["," ");
                        response=response.replace("]"," ");
                        response=response.replace("{"," ");
                        response=response.replace("}"," ");
                        response=response.replace(":",",");
                        response=response.split(",");
                        response[2]=response[2].replace("\"mdp\":\"", " ");
                        response[2]=response[2].replace("\"", " ");
                        response[2]=response[2].substr(1, response[2].length -2);
                        response[3]=response[3].replace("\"saltPwd\":\"", " ");
                        response[3]=response[3].replace("\"", " ");
                        response[3]=response[3].substr(1, response[3].length -4);
                        var AffichageReponse = document.getElementById("response");
                        AffichageReponse.innerHTML ="<p>mdp : "+response[1]+"</p><p>"+dechiffreMdpSite(response[2], response[3])+"</p>";
                    }
                }
            }
            else{
                alert('erreur');
            }
        }
    }

}



function strRandom(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

function dechiffreMdpSite(mdp , sel)
{
    var key = "AEARXZSCTEDUTB7I9088888OYqxsrcedrvbfgunihjpkN9UIUY84EZ56U79IPONPUTREXY4O789UY8V7R6T7BYO8";
    var decrypt = CryptoJS.AES.decrypt(mdp, key);
    return decrypt.substring(0,decrypt.length - sel.length);
}

function chiffrementMdpSite(mdpSite, sel)
{

    var key = "AEARXZSCTEDUTB7I9088888OYqxsrcedrvbfgunihjpkN9UIUY84EZ56U79IPONPUTREXY4O789UY8V7R6T7BYO8";
    var encrypMdp = CryptoJS.AES.encrypt(mdpSite + sel ,key  );
    return encrypMdp;
}

function AfficheMdp()
{
    authentificationUtilisateur("requestPwd");
}



function AjoutSite()
{
    var identifiantPM   = document.getElementById("identifiantPM").value;
    var sel = strRandom(Math.random()*25+5);

    var idSite         = document.getElementById("idSite").value;
    var mdpSite        = document.getElementById("mdpSite").value;
    var linkSite       = document.getElementById("linkSite").value;

    mdpSite = chiffrementMdpSite(mdpSite , sel);

    var req = new XMLHttpRequest();

    req.open("get","http://localhost:4000/authUserAddWebsite?idUserPrincipal="+ identifiantPM  +"&mdp="+ mdpSite +"&urlSite="+  linkSite +"&identifiantUserSite="+  idSite +"&saltPwd=" + sel, true);
    req.send();

    req.onreadystatechange = function() {
        if (req.readyState == XMLHttpRequest.DONE) {
            if(req.responseText){
                alert ("identité ajoutée");
            }
        }
    }
}



