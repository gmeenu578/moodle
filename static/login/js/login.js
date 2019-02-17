function validate()
{
	
var username = document.getElementById("username").value;
var password = document.getElementById("password").value;
if(username == "Enter USN" || password == "Default:USN")
{
	//alert("Username or Password field is empty!");
	document.getElementById("error").innerHTML = "username or password empty!"	;
	return; 
}
var url = 'http://localhost:4000/api/login/student';
var xml = new XMLHttpRequest();
xml.open('POST' , url ,true);
xml.withCredentials = true;
xml.setRequestHeader( 'Access-Control-Allow-Origin', '*');
xml.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
xml.send(JSON.stringify({ 'username': username, 'password': password}));
xml.onreadystatechange = processRequest;

function processRequest(){
	if(xml.readyState == 4 && xml.status == 200){
		response = JSON.parse(xml.responseText);
		if(response['status'] == 0)
			document.getElementById("error").innerHTML = "Incorrect Combination";
		else if(response['status'] == 1)
			window.location = "studentdata.html";
		}
	}
}


function inputFocus(i) {
    if (i.value == i.defaultValue) { i.value = ""; i.style.color = "#000"; }
}
function inputBlur(i) {
    if (i.value == "") { i.value = i.defaultValue; i.style.color = "#888"; }
}
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
function clearcookies(cname)
{
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