var usn;						//usn as global variable to be used in many function
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

function updatescores(){

	var url = 'http://localhost:4000/api/updatescores/'+ usn;
	var xml = new XMLHttpRequest();
	xml.open('POST' , url ,true);
	xml.withCredentials = true;
	xml.setRequestHeader( 'Access-Control-Allow-Origin', '*');
	xml.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	xml.send(makeResponse());
	xml.onreadystatechange = processRequest;

	function processRequest(){
	if(xml.readyState == 4 && xml.status == 200){
		alert(xml.responseText);
		fetchdata();	
	}	  
	}
}
function makeResponse(){
	var response = {};
	let tableElem = document.getElementById('table-marks').rows;
	for(var i=0; i<tableElem.length; i++){
		let elem = tableElem[i];
		if(i !== 0){
			var subjectCode = elem.cells[0].innerText;
			var subjectName = elem.cells[1].innerText;
			var prevMarks = elem.cells[2].innerText;
			var score = parseInt(elem.cells[3].children[0].value);
			var outOf = parseInt(elem.cells[4].children[0].value);

			const COLUMN_NAME = subjectCode.trim() + '_' + subjectName.replace(new RegExp(' ', 'g'), '_');
			let markSplit = prevMarks.split('/', 2);
			let m1 = parseInt(markSplit[0]);
			let m2 = parseInt(markSplit[1]);
			if(!isNaN(score) && !isNaN(outOf) ){					//NaN - Not A Number
				m1 += score;
				m2 += outOf;
				response[COLUMN_NAME] = m1 + '/' + m2;
			}
		}
	}
	return JSON.stringify(response);
}
function fetchdata()        									//fetching table for student data
{
usn = document.getElementById('usn').value;
usn = usn.toUpperCase();
var url = 'http://localhost:4000/api/fetchdata/' + usn;
var xhr = new XMLHttpRequest();
xhr.withCredentials = true;
xhr.addEventListener("readystatechange", function () {
if (this.readyState === 4) {
data = JSON.parse(this.responseText);
if (data["status"] == 'invalid usn'){
	alert("invalid USN");
	return;
}
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
        genStr += '</tr>';
    }
  });
  ele.innerHTML = genStr; 
document.getElementById('table').style.visibility = "visible";
document.getElementById('option-div').style.visibility = "visible";
document.getElementById('enroll').style.visibility = "visible";
document.getElementById('edit').style.visibility = "visible";
document.getElementById('update_scores').style.visibility = "hidden";
}
});
xhr.open("GET" , url);
xhr.setRequestHeader( 'Access-Control-Allow-Origin', '*');
xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
xhr.send();

}

function showeditboxes(){
	let tableElem = document.getElementById('table-marks').rows;
	for(var i=0; i<tableElem.length; i++){
		let elem = tableElem[i];
		if(i == 0){
			elem.innerHTML += '<th>Marks</th><th>Out of</th>';
		}else{
			elem.innerHTML += '<td><input type="number"></input></td><td><input type="number"></input></td>'
			document.getElementById('edit').style.visibility = "hidden";
			document.getElementById('update_scores').style.visibility = "visible";
		}
	}

}

function fetchcourses()									// For Enrolling in New Course
{
var url = 'http://localhost:4000/api/fetchcourses';
var xhr = new XMLHttpRequest();
xhr.withCredentials = true;
xhr.addEventListener("readystatechange", function () {
  if (this.readyState === 4) {
    data = JSON.parse(this.responseText);
    var genStr = '';
    genStr += '<option value="option">Enroll New Course</option>';
    let elem = document.getElementById('courses');
    data.forEach(function (item){
        var s = item['COLUMN_NAME'];
        var i = s.indexOf('_');
        var splits = [s.slice(0,i), s.slice(i+1)];
        var subjectName = splits[1];
        subjectName = subjectName.replace(new RegExp('_', 'g'), ' ');
        genStr += '<option value="' + splits[0] + '">' + splits[0] + ' - ' + subjectName + '</option>';
    });
    elem.innerHTML += genStr;
  }
});
xhr.open("GET" , url);
xhr.setRequestHeader( 'Access-Control-Allow-Origin', '*');
xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
xhr.send();
}
function enrollNewCourse(){
	var selection = document.getElementById('courses');
	selection = selection.options[selection.selectedIndex].text;
	var COLUMN_NAME = selection.replace('- ' , '');
	COLUMN_NAME = COLUMN_NAME.replace(new RegExp(' ' , 'g'), '_');
	var url = 'http://localhost:4000/api/enrollNewCourse/' + COLUMN_NAME + '/' +usn;
	var xhr = new XMLHttpRequest();
	xhr.withCredentials = true;
	xhr.addEventListener("readystatechange", function () {
	  if (this.readyState === 4) {
	    alert(this.responseText);
	    fetchdata();
	  }
	});
	xhr.open("GET" , url);
	xhr.setRequestHeader( 'Access-Control-Allow-Origin', '*');
	xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	xhr.send();
}
function logout(){
clearcookies('userid');
clearcookies('type');
window.location = "login.html"
}