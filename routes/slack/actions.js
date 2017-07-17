const express = require('express');
const router = express.Router();
const responses = require('../../lib/slack/responses');
const User = require('../../models/users');

router.post('/', function(req, res) {
  const formData = JSON.parse(req.body.payload);
  console.log(formData);

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
    res.json(responses.timezoneForm());
  }
  else if (formData.callback_id === 'timezone_selection') {
    res.json({text: 'Great! Your request has been submitted. We\'ll let you know when you\'ve been matched with a pair programming partner!' });
  }
});

module.exports = router;
