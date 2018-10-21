// var attempt = 3; // Variable to count number of attempts.
// Below function Executes on click of login button.
function validate(){
var username = document.getElementById("userid").value;
var password = document.getElementById("password").value;
if ( username == "test" && password == "test123"){
// alert ("Login successfully");
window.location = "success.html"; // Redirecting to other page.
return false;
}
else{
// attempt --;// Decrementing by one.
// alert("You have left "+attempt+" attempt;");
// Disabling fields after 3 attempts.
// if( attempt == 0){
	alert("Incorrect Combination");
document.getElementById("userid").disabled = true;
document.getElementById("password").disabled = true;
document.getElementById("submit").disabled = true;
return false;
}
}
// }
function inputFocus(i) {
    if (i.value == i.defaultValue) { i.value = ""; i.style.color = "#000"; }
}
function inputBlur(i) {
    if (i.value == "") { i.value = i.defaultValue; i.style.color = "#888"; }
}

