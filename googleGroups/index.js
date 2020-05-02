// const { GOOGLE_GROUPS_API_KEY } = require('./config.js');
// ------------------------------
// Google Groups API Integrations
// ------------------------------
const { google } = require('googleapis');
const key = require('../../google/admin_sdk_client_secret.json');

const scopes = 'https://www.googleapis.com/auth/admin.directory.group';
const jwt = new google.auth.JWT(key.client_email, null, key.private_key, scopes);

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
    return 'wahooooo!';
  });
};




exports.getSheet = async () => {
  try {
    await jwt.authorize((err, tokens) => {
      if (err) return;
      console.log('Successfully connected!');
    });
    await listRows(jwt);
  } catch (error) {
    console.log(error);
    return error;
  }
  return 'yay!';
};

const listRows = async (auth) => {
  console.log(auth);
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.get({
    spreadsheetId: '1KhQWhrVGNOQQz9jYHVNpfQj63PsYe4t5K4K2_qXwnuo',
    range: 'Sheet1!A:E',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows = res.data.values;
    if (rows.length) {
      console.log('Name, Major:');
      // Print columns A and E, which correspond to indices 0 and 4.
      rows.map((row) => {
        console.log(`${row[0]}, ${row[4]}`);
      });
    } else {
      console.log('No data found.');
    }
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
