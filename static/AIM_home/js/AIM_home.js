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
function fetchname(){
var xhr = new XMLHttpRequest();
xhr.withCredentials = true;
xhr.addEventListener("readystatechange", function () {
  if (this.readyState === 4) {
  	// console.log(typeof(this.responseText));
  	document.getElementById("name").textContent +=this.responseText;
  }
});

xhr.open("GET", "http://localhost:4000/api/fetchname/admin");
xhr.setRequestHeader( 'Access-Control-Allow-Origin', '*');
xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
xhr.send();
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