// const { GOOGLE_GROUPS_API_KEY } = require('./config.js');
// ------------------------------
// Google Groups API Integrations
// ------------------------------
const { google } = require('googleapis');

const key = require('../../google/admin_sdk_client_secret.json');

const scopes = 'https://www.googleapis.com/auth/admin.directory.group';
const jwt = new google.auth.JWT(key.client_email, null, key.private_key);
const viewId = 'XXXXXXX';

// Write a student to a group
exports.addGroupMember = async () => {
  try {
    await jwt.authorize((err, response) => {
      console.log(response);
      return response;
    });
    const data = await google.groupssettings().get(
      {
        auth: jwt,
        ids: `ga:${viewId}`,
        'start-date': '30daysAgo',
        'end-date': 'today',
        metrics: 'ga:pageviews',
      },
      (err, result) => {
        console.log(err, result);
      },
    );
  } catch (error) {
    console.log(error);
    return error;
  }
  return 'yay!';
};

// Delete a student from a group
exports.removeGroupMember = async () => {

};

// Delete all students from a group
exports.removeAllGroupMembers = async () => {

};

// Read all members in a group
exports.getAllGroupMembers = async () => {

};
