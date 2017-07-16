function newUser(displayName) {
  const response = {};
  response.text = `Hi, ${displayName}!\nWelcome to *Chingu PP*, your one-stop shop for finding a pair programming partner within the Chingu Cohorts. \n\nTo be matched with a pair programming partner, just click the "Pair Me!" button to fill out a quick two-question form. Once you\'ve been matched with another member of your cohort, you\'ll receive a direct message, right here in Slack!`
  return response;
}

module.exports.newUser = newUser;
