// document.getElementById("request-form-button").addEventListener("click", function() {
//   console.log('clicked');
//   document.getElementById("request-form").style.display = "block";
// });
document.getElementById('timezone-select').addEventListener('change', function(e){
  console.log(e.target.value);
  
  var xhr = new XMLHttpRequest();
    xhr.open('PUT', '/update-user');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            var userInfo = JSON.parse(xhr.responseText);
        }
    };
    xhr.send(JSON.stringify({
        newTimeZone: e.target.value
    }));
});