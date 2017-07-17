const fccScore = require('./fccScore');

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

function categoryForm() {
  const response = {};
  response.text = 'Let\'s find you a pair programming partner!';
  response.attachments = [
    fccCategoryAttachment()
  ];
  return response;
}

function sectionForm(category) {
  const response = {};
  response.text = `Great! You\'re working toward the ${category}! What are you working on within that category?`;
  response.attachments = [
    fccSectionAttachment(category)
  ];
  return response;
}

function timezoneForm() {
  const response = {};
  response.text = `Just one more question.`;
  response.attachments = [
    timezoneAttachment()
  ];
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

function fccCategoryAttachment() {
  var attachment = {
    text: 'What freeCodeCamp category are you currently working on?',
    fallback: 'Uh-Oh. Something broke. :frowning: You can still apply by heading over to the Chingu-PP <http://localhost:3000|website>',
    callback_id: 'category_selection',
    actions: [
      {
        name: 'category_list',
        text: 'I\'m working on...',
        type: 'select',
        options: formatFccCategories()
      }
    ]
  }
  return attachment;
}

function fccSectionAttachment(category) {
  var attachment = {
    text: 'What freeCodeCamp section are you currently working on?',
    fallback: 'Uh-Oh. Something broke. :frowning: You can still apply by heading over to the Chingu-PP <http://localhost:3000|website>',
    callback_id: 'section_selection',
    actions: [
      {
        name: 'section_list',
        text: 'I\'m working on...',
        type: 'select',
        options: formatLevels(category)
      }
    ]
  }
  return attachment;
}

function timezoneAttachment() {
  var attachment = {
    text: 'What timezone are you coding from?',
    fallback: 'Uh-Oh. Something broke. :frowning: You can still apply by heading over to the Chingu-PP <http://localhost:3000|website>',
    callback_id: 'timezone_selection',
    actions: [
      {
        name: 'timezone_list',
        text: 'I\'m coding from...',
        type: 'select',
        options: formatTimezones()
      }
    ]
  }
  return attachment;
}

function formatTimezones() {
  var timezones = [-12,-11,-10,-9.5,-9,-8,-7,-6,-5,-4,-3.5,-3,-2.5,-2,-1,0,1,2,3,3.5,4,4.5,5,5.5,6,6.5,7,8,9,9.5,10,10.5,11,12,13,14];
  return timezones.map(zone => {
    return {
      text: 'UTC ' + zone,
      value: zone
    }
  });
}

function formatLevels(category) {
    return fccScore.toLevelsArray().filter(
      level => level[0] === category
    )
    .map(
      level => {
        return {
          text: level[1],
          value: fccScore.getFccScore(level[1])
        }
      }
    )
}

function formatFccCategories() {
  return fccScore.levels.map(level =>
    {
      return {
        'text': level.category,
        'value': level.category
      }
    }
  )
}

module.exports.newUser = newUser;
module.exports.returningUser = returningUser;
module.exports.categoryForm = categoryForm;
module.exports.sectionForm = sectionForm;
module.exports.timezoneForm = timezoneForm;
