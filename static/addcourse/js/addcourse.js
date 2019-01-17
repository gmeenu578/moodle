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

function addcourse(){

var code = document.getElementById("coursecode").value;
code = code.toUpperCase();
var name= document.getElementById("coursename").value;
name = name.toUpperCase();
if(code == "10CS501" || name == "" || code == "")
{
	document.getElementById("error").innerHTML = "Input both fields:";
	return false; 

}
else
	{	
	var url = 'http://localhost:4000/api/addcourse';
	var xml = new XMLHttpRequest();
	xml.open('POST' , url ,true);
	xml.withCredentials = true;
	xml.setRequestHeader( 'Access-Control-Allow-Origin', '*');
	xml.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	xml.send(JSON.stringify({ 'coursecode': code, 'coursename': name}));
	xml.onreadystatechange = processRequest;

	function processRequest(){
	if(xml.readyState == 4 && xml.status == 200){
		response = JSON.parse(xml.responseText);	
		if(response["status"] == "Already exists"){
			document.getElementById("error").innerHTML = code + " already exists";
			document.getElementById('course_form').reset();
		}
		else if(response['status'] == 'Course added')
		{
			document.getElementById("error").innerHTML = code + " added"; 
			document.getElementById('course_form').reset();
		}
}
	  
	}
}

}
function logout(){
clearcookies('userid');
clearcookies('type');
window.location = "login.html"
}