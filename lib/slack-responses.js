function newUser(displayName) {
  const response = {};
  response.text = `Hi, ${displayName}!\nWelcome to *Chingu PP*, your one-stop shop for finding a pair programming partner within the Chingu Cohorts. \n\nTo be matched with a pair programming partner, just click the "Pair Me!" button to fill out a quick two-question form. Once you\'ve been matched with another member of your cohort, you\'ll receive a direct message, right here in Slack!`

  response.attachments = [
    pairMeButton()
  ];

  return response;
}

function returningUser(displayName) {
  const response = {};
  response.text = `Welcome back, ${displayName}!`;
  response.attachments = [pairMeButton()];

  return response;
}

function pairMeButton() {
  var attachment = {
    text: 'Ready to apply for a pair programming partner?',
    fallback: 'Uh-Oh. Our button\'s broke. :frowning: You can still apply by heading over to the Chingu-PP <http://localhost:3000|website>',
    callback_id: 'form_request',
    actions: [
      {
        name: 'form_request',
        text: 'Pair Me!',
        type: 'button',
        value: 'pair_me'
      }
    ]
  }
  return attachment;
}

module.exports.newUser = newUser;
module.exports.returningUser = returningUser;
