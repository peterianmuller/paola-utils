// const { GOOGLE_GROUPS_API_KEY } = require('./config.js');
// ------------------------------
// Google Groups API Integrations
// ------------------------------
const { google } = require('googleapis');
const key = require('../../google/admin_sdk_client_secret.json');

const scopes = ['https://www.googleapis.com/auth/admin.directory.group'];
const jwt = new google.auth.JWT(key.client_email, null, key.private_key, scopes, 'storage@galvanize.com');

const auth = async () => {
  await jwt.authorize((err, token) => {
    if (err) return err;
    return token;
  });
};

// Read all members in a group
exports.getAllGroupMembers = async (groupId) => {
  try {
    await auth();
    const service = await google.admin(
      { version: 'directory_v1', auth: jwt },
    );
    const res = await service.members.list({
      groupKey: groupId,
    });
    console.log(res.data);
    return res.data.members;
  } catch (error) {
    console.log(error);
    return error.message;
  }
};

exports.addGroupMember = async (groupId, userEmail) => {
  try {
    await auth();
    const service = await google.admin({ version: 'directory_v1', auth: jwt });
    service.members.insert({
      groupKey: groupId,
      resource: { email: userEmail },
    }, (err, res) => {
      if (err) return console.error('Error:', err.message);
      return res.data;
    });
  } catch (error) {
    return error;
  }
};

// Delete a student from a group
exports.removeGroupMember = async (groupId, userEmail) => {
  try {
    await auth();
    const service = await google.admin({ version: 'directory_v1', auth: jwt });
    service.members.delete({
      groupKey: groupId,
      memberKey: userEmail,
    }, (err, res) => {
      if (err) return console.error('Error:', err.message);
      return res.status === 204;
    });
  } catch (error) {
    return error;
  }
};

// Delete all students from a group
exports.removeAllGroupMembers = async () => {

};
