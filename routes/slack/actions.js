const express = require('express');
const router = express.Router();
const responses = require('../../lib/slack/responses');
const fccScore = require('../../lib/fccScore.js');
const User = require('../../models/users');
const runMatch = require('../../lib/match_user.js');

router.post('/', function(req, res) {
  const formData = JSON.parse(req.body.payload);

  if (formData.token !== process.env.VERIFICATION_TOKEN) {
    return;
  }
  if (formData.callback_id === 'form_request') {
    res.json(responses.categoryForm());
  }
  else if (formData.callback_id === 'category_selection') {
    var category = formData.actions[0].selected_options[0].value;
    res.json(responses.sectionForm(category));
  }
  else if (formData.callback_id === 'section_selection') {
    User.findOneAndUpdate(
      { 'slack.id': formData.user.id, 'slack.team.id': formData.team.id },
      { $set: {
        'profile.fccScore': formData.actions[0].selected_options[0].value,
        'profile.fccLevel': fccScore.getLevel(formData.actions[0].selected_options[0].value)
      } }
    )
    .then(function sendResponse() {
      res.json(responses.timezoneForm());
    })
    .catch(error => console.error(error));
  }
  else if (formData.callback_id === 'timezone_selection') {
    User.findOneAndUpdate(
      { 'slack.id': formData.user.id, 'slack.team.id': formData.team.id },
      { $set: {
        'profile.timezone': formData.actions[0].selected_options[0].value,
      } },
      { new: true }
    )
    .then(function(user) {
      res.json(responses.submitForm(user.profile.fccLevel, user.profile.timezone));
    })
    .catch(error => console.error(error));
    //res.json({text: 'Great! Your request has been submitted. We\'ll let you know when you\'ve been matched with a pair programming partner!' });
  }
  else if (formData.callback_id === 'form_submit') {
    if (formData.actions[0].value === 'submit') {
      User.findOneAndUpdate(
        { 'slack.id': formData.user.id, 'slack.team.id': formData.team.id },
        { $set: { 'pending.created': new Date() } },
        { new: true }
      )
      .then(function(user) {
        runMatch(user);
        res.json(responses.successMessage());
      })
      .catch(function(error) { console.error(error); });
    }
    else {
      User.findOneAndUpdate(
        { 'slack.id': formData.user.id, 'slack.team.id': formData.team.id },
        { $unset: { 'pending.created': '' } }
      )
      res.json(responses.cancelMessage());
    }
  }
});

module.exports = router;
