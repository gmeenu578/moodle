function fetchdata()
{
var xhr = new XMLHttpRequest();
xhr.withCredentials = true;
xhr.addEventListener("readystatechange", function () {
  if (this.readyState === 4) {
    visibility();
    data = JSON.parse(this.responseText);
    let genStr = '<tr><th scope="col">Subject Code</th><th scope="col">Subject Title</th><th scope="col">Score</th></tr>';
    const tdb = '<td>';
    const tde = '</td>';
    let ele = document.getElementById('table-marks');
    Object.keys(data)
      .forEach(function eachKey(key) { 
        if(key !== 'usn'){
            genStr += '<tr>'
            var s = key;
            var i = s.indexOf('_');
            var splits = [s.slice(0,i), s.slice(i+1)];
            var subjectName = splits[1];
            subjectName = subjectName.replace(new RegExp('_', 'g'), ' ');
            genStr += tdb + splits[0] + tde;
            genStr += tdb + subjectName + tde; 
            genStr += tdb + data[key] + tde;
            genStr += '</tr>' 
        }
      });
   ele.innerHTML = genStr; 
  }
});

xhr.open("GET", "http://localhost:4000/api/fetchstudentdata");
xhr.setRequestHeader( 'Access-Control-Allow-Origin', '*');
xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
xhr.send();
	
}
function visibility()
{
    document.getElementById('loader').style.display="none";
    document.getElementById('table').style.visibility="visible";
    document.getElementById('logout').style.visibility="visible";

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
    console.log(xhr.readyState);
  if (this.readyState === 4) {
    // console.log(typeof(this.responseText));
    document.getElementById("name").textContent +=this.responseText;
  }
});

xhr.open("GET", "http://localhost:4000/api/fetchname/student");
xhr.setRequestHeader( 'Access-Control-Allow-Origin', '*');
xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
xhr.send();
}
function logout(){

clearcookies('userid');
clearcookies('type');
window.location = "login.html"
}