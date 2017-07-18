/*
Scratch code that will (hopefully) become useful when we start using the slack app.
It looks like we might have an issue with team info being duplicated.
It's something that we should at least check out:
  - What happens when an app is reinstalled?
  - What happens when two people from one team install the same app?
*/

router.get('/testing', function(req, res) {
  var token = process.env.ACCESS_TOKEN;
  var users = "U5RPB4K53,U5RCWV0LS,U6987A6AC";
  slack.mpim.open({token, users}, (err, data) => {
    if (err) {
      console.log(err);
    }
    else {
      console.log(data);
      let channel = data.group.id;
      let text = "This is a test. If this works, then we can open a multi-party direct message and post something.";
      slack.chat.postMessage({token, channel, text}, (err, data) => {
        if (err) {
          console.log(err);
        }
        console.log(data);
       })
    }
  });
  res.send('trying this again');
});
