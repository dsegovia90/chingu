document.getElementById("request-form-button").addEventListener("click", function() {
  console.log('clicked');
  document.getElementById("request-form").style.display = "block";
});

document.getElementById('timezone-select').addEventListener('change', function (e) {

  /*  Checks if the undefined-option element exists, and
      if it does, it deletes it. This is to prevent the
      selection of an "undefined" option. In pug's side,
      if the user has already set up a timezone, the
      element won't appear at all. So this function is skipped. */
  if (document.getElementById('undefined-option')) {
    document.getElementById('undefined-option').remove();
  }


  /*  This is the ajax call, sending a JSON to the server
      (backend) with the element newTimeZone: and the value of
      the select element that is selected (duh!). */
  var xhr = new XMLHttpRequest();
  xhr.open('PUT', '/update-timezone');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function () {
    if (xhr.status === 200) {
      var userInfo = JSON.parse(xhr.responseText);
    }
  };

  // This is able to recieve data back from the server.
  xhr.onreadystatechange = function(){
    if(this.readyState!==4)return
    if(this.status===200){
      console.log(JSON.parse(this.responseText))
    }
  }
  xhr.send(JSON.stringify({
    newTimeZone: e.target.value
  }));
});
