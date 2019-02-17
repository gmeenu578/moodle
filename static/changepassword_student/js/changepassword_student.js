function getCookies(cname) {
		    var name = cname + "=";
		    var decodedCookie = decodeURIComponent(document.cookie);
		    var ca = decodedCookie.split(';');
		    for(var i = 0; i <ca.length; i++) {
		        var c = ca[i];
		        while (c.charAt(0) == ' ') {
		            c = c.substring(1);
		        }
		        if (c.indexOf(name) == 0) {
		            return c.substring(name.length, c.length);
		        }
		    }
    		return "";
		}

function inputFocus(i) {
    if (i.value == i.defaultValue) { i.value = ""; i.style.color = "#000"; }
}

function inputBlur(i) {
    if (i.value == "") { i.value = i.defaultValue; i.style.color = "#888"; }
}	
function clearcookies(cname)
{
	var cookies = document.cookie.split(";");

	for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = cname + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT ; path = /;";
    }
    window.location = "login.html";
}


function searchkeypress(e)
{
    // look for window.event in case event isn't passed in
    e = e || window.event;
    if (e.keyCode == 13)
    {
        document.getElementById('submit').click();
        return false;
    }
    return true;
}

function changepassword(){

var cur = document.getElementById("current").value;
var newpassword = document.getElementById("new").value;
var confirmnew = document.getElementById("confirmnew").value;
if(cur == "" || newpassword == "" || confirmnew == "")
{
	document.getElementById("error").innerHTML = "All fields are compulsory:";
	return false; 

}
else if(newpassword != confirmnew)
{
	document.getElementById("error").innerHTML = "New passwords don't match :";
	return false; 
}

else
	{	
	var url = 'http://localhost:4000/api/changepassword/student';
	var xml = new XMLHttpRequest();
	xml.open('POST' , url ,true);
	xml.withCredentials = true;
	xml.setRequestHeader( 'Access-Control-Allow-Origin', '*');
	xml.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	xml.send(JSON.stringify({ 'currentpassword': cur, 'newpassword': newpassword }));
	xml.onreadystatechange = processRequest;

	function processRequest(){
	if(xml.readyState == 4 && xml.status == 200){
		response = JSON.parse(xml.responseText);
		document.getElementById("error").innerHTML = response["status"];
		document.getElementById('changepassword').reset(); //to reset the form
}
	  
	}
}

}
function clearcookies(cname)
{
	 console.log('clearcookies');
	var cookies = document.cookie.split(";");

	for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = cname + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT ; path = /;";
    }
}
function logout(){
clearcookies('userid');
clearcookies('type');
window.location = "login.html"
}