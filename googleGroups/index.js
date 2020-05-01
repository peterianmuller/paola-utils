// const { GOOGLE_GROUPS_API_KEY } = require('./config.js');
// ------------------------------
// Google Groups API Integrations
// ------------------------------
const { google } = require('googleapis');

const key = require('../../google/admin_sdk_client_secret.json');

const scopes = 'https://www.googleapis.com/auth/admin.directory.group';
const jwt = new google.auth.JWT(key.client_email, null, key.private_key, scopes, 'murph.grainger@galvanize.com');

// Write a student to a group
exports.addGroupMember = async () => {
  try {
    await jwt.authorize((err, tokens) => {
      if (err) return;
      console.log('Successfully connected!');
    });
    await listUsers(jwt);
  } catch (error) {
    console.log(error);
    return error;
  }
  return 'yay!';
};

const listUsers = async (auth) => {
  const service = await google.admin({ version: 'directory_v1', auth });
  service.groups.get({
    groupKey: 'paola-sandbox@galvanize.com',
  }, (err, res) => {
    if (err) return console.error('The API returned an error:', err.message);
    console.log('res', res);
  });
}

// Delete a student from a group
exports.removeGroupMember = async () => {

};

// Delete all students from a group
exports.removeAllGroupMembers = async () => {

};

// Read all members in a group
exports.getAllGroupMembers = async () => {

};
