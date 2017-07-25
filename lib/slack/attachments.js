const fccScore = require('../fccScore');

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

function submitButton() {
  var attachment = {
    text: 'Ready to find a pair programming partner?',
    fallback: 'Uh-Oh. Our button\'s broke. :frowning: You can still apply by heading over to the Chingu-PP <http://locahlost:3000|website>',
    callback_id: 'form_submit',
    actions: [
      {
        name: 'form_submit',
        text: 'Submit',
        type: 'button',
        value: 'submit'
      },
      {
        name: 'form_cancel',
        text: 'Cancel',
        type: 'button',
        value: 'cancel'
      }
    ]
  }
  return attachment;
}

function cancelPending() {
  var attachment = {
    text: 'Do you wish to cancel your request?',
    fallback: 'Uh-Oh. Our button\'s broke. :frowning: You can still apply by heading over to the Chingu-PP <http://locahlost:3000|website>',
    callback_id: 'form_submit',
    actions: [
      {
        name: 'form_cancel',
        text: 'Cancel',
        type: 'button',
        value: 'cancel'
      }
    ]
  }
  return attachment;
}

function categorySelector() {
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

function sectionSelector(category) {
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

function timezoneSelector() {
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
  var timezones = require('../timezones.js')
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

module.exports.pairMeButton = pairMeButton;
module.exports.categorySelector = categorySelector;
module.exports.sectionSelector = sectionSelector;
module.exports.timezoneSelector = timezoneSelector;
module.exports.submitButton = submitButton;
module.exports.cancelPending = cancelPending;
