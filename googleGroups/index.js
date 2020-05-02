// const { GOOGLE_GROUPS_API_KEY } = require('./config.js');
// ------------------------------
// Google Groups API Integrations
// ------------------------------
const { google } = require('googleapis');
const key = require('../../google/credential.json');

const scopes = 'https://www.googleapis.com/auth/admin.directory.group';
const jwt = new google.auth.JWT(key.client_email, null, key.private_key, scopes, 'paola@paolaprecourse.com');

const auth = async () => {
  await jwt.authorize((err, token) => {
    if (err) return err;
    return token;
  });
};

// Get the group
exports.getGroup = async () => {
  try {
    await auth();
    const service = await google.admin({ version: 'directory_v1', auth: jwt });
    service.groups.get({
      groupKey: 'paola-precourse@paolaprecourse.com',
    }, (err, res) => {
      if (err) return console.error('The API returned an error:', err.message);
      return res.data;
    });
  } catch (error) {
    return error;
  }
  return 'yay!';
};

exports.addGroupMember = async () => {

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
