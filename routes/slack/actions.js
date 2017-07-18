const express = require('express');
const router = express.Router();
const responses = require('../../lib/slack/responses');
const fccScore = require('../../lib/fccScore.js');
const User = require('../../models/users');
const runMatch = require('../../lib/match_user.js');

router.post('/', function(req, res) {
  // get and validate form information
  const formData = JSON.parse(req.body.payload);
  if (formData.token !== process.env.VERIFICATION_TOKEN) {
    return;
  }
  // receive: request for form, send: fcc certificate selector
  if (formData.callback_id === 'form_request') {
    res.json(responses.categoryForm());
  }
  // receive: certificate info, send: sections in certificate
  else if (formData.callback_id === 'category_selection') {
    var category = formData.actions[0].selected_options[0].value;
    res.json(responses.sectionForm(category));
  }
  // receive: fccScore, send: timezone selector
  else if (formData.callback_id === 'section_selection') {
    User.findOneAndUpdate(
      { 'slack.id': formData.user.id, 'slack.team.id': formData.team.id },
      { $set: {
        'profile.fccScore': formData.actions[0].selected_options[0].value,
        'profile.fccLevel': fccScore.getLevel(formData.actions[0].selected_options[0].value)
      } }
    )
    .then(function() {
      res.json(responses.timezoneForm());
    })
    .catch(error => console.error(error));
  }
  // receive: timezone selection, send: form submit button
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
  }
  // receive: form submit/cancel button, send: confirmation message
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
      .then(function() {
        res.json(responses.cancelMessage());
      })
      .catch(function(error) { console.error(error); });
    }
  }
});

module.exports = router;
