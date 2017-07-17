const attachments = require('./attachments.js')

function newUser(displayName) {
  const response = {};
  response.text = `Hi, ${displayName}!\nWelcome to *Chingu PP*, your one-stop shop for finding a pair programming partner within the Chingu Cohorts. \n\nTo be matched with a pair programming partner, just click the "Pair Me!" button to fill out a quick two-question form. Once you\'ve been matched with another member of your cohort, you\'ll receive a direct message, right here in Slack!`

  response.attachments = [attachments.pairMeButton()];

  return response;
}

function returningUser(displayName) {
  const response = {};
  response.text = `Welcome back, ${displayName}!`;
  response.attachments = [attachments.pairMeButton()];
  return response;
}

function categoryForm() {
  const response = {};
  response.text = 'Let\'s find you a pair programming partner!';
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

module.exports.newUser = newUser;
module.exports.returningUser = returningUser;
module.exports.categoryForm = categoryForm;
module.exports.sectionForm = sectionForm;
module.exports.timezoneForm = timezoneForm;
