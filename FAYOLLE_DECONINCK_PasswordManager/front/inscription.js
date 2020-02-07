function strRandom(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
function submitForm(){

    if (document.getElementById("mdp").value!==document.getElementById("mdpBis").value){
        alert ("mots de passe différents, veuillez recommencer");
    }
    else{

        var sel = strRandom(Math.random()*25+5);

        var hashCode = md5(document.getElementById("mdp").value + sel);

        var identifiantPM = document.getElementById("identifiantPM").value;




        var req = new XMLHttpRequest();

        req.open("get","http://localhost:4000/createUser?idUser="+ identifiantPM +"&mdpUserHashe=" + hashCode + "&saltPwd="+sel, true);
        req.send();


        req.onreadystatechange = function() {
            if (req.readyState == XMLHttpRequest.DONE) {
                if (req.responseText){
                    alert('inscription reussie')
                }
                else{
                    alert('erreur');
                }
            }
        }
    }

}