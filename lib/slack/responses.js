const attachments = require('./attachments.js')

function newUser(displayName) {
  const response = {};
  response.text = `Hi, ${displayName}!\nWelcome to *Chingu PP*, your one-stop shop for finding a pair programming partner within the Chingu Cohorts. \n\nTo be matched with a pair programming partner, just click the "Pair Me!" button to fill out a quick two-question form. Once you\'ve been matched with another member of your cohort, you\'ll receive a direct message, right here in Slack!`
  response.attachments = [attachments.pairMeButton()];

  return response;
}

function returningUser(displayName, pending) {
  const response = {};
  response.text = `Welcome back, ${displayName}!`;
  response.attachments = [attachments.pairMeButton()];
  if (pending) {
    response.text += 'Your request is still pending. Use the "Pair Me" button to create a new request (clicking this button will overwrite your pending request), or use the "Cancel" button to cancel your current request.';
    response.attachments.push(attachments.cancelPending());
  }
  return response;
}

function categoryForm() {
  const response = {};
  response.text = 'Let\'s find you a pair programming partner!';
  response.replace_original = false;
  response.attachments = [attachments.categorySelector()];
  return response;
}

function sectionForm(category) {
  const response = {};
  response.text = `Great! You\'re working toward the ${category}! What are you working on within that category?`;
  response.attachments = [attachments.sectionSelector(category)];
  return response;
}

function timezoneForm() {
  const response = {};
  response.text = `Just one more question.`;
  response.attachments = [attachments.timezoneSelector()];
  return response;
}

function submitForm(level, timezone) {
  const response = {};
  response.text = `Excellent! You are currently working on the ${level}, and are coding from the timezone UTC ${timezone}.
  If this is correct, click the "Submit" button to create your request!`;
  response.attachments = [attachments.submitButton()];
  return response;
}

function successMessage() {
  return {
    text: "Hooray! Your request has been submitted. We'll message you when you are matched with a pair programming partner!"
  };
}

function cancelMessage() {
  return {
    text: "Your request has been canceled. When you're ready to try again, just use the /pair-programming command to create a new request."
  };
}

module.exports.newUser = newUser;
module.exports.returningUser = returningUser;
module.exports.categoryForm = categoryForm;
module.exports.sectionForm = sectionForm;
module.exports.timezoneForm = timezoneForm;
module.exports.submitForm = submitForm;
module.exports.successMessage = successMessage;
module.exports.cancelMessage = cancelMessage;
