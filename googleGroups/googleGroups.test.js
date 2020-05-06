require('dotenv').config();
const {
  getAllGroupMembers,
  addGroupMember,
  removeGroupMember,
} = require('.');

const { google } = require('googleapis');
const key = require('../../google/admin_sdk_client_secret.json');

const scopes = ['https://www.googleapis.com/auth/admin.directory.group'];
const jwt = new google.auth.JWT(key.client_email, null, key.private_key, scopes, 'paola@galvanize.com');


const GOOGLE_GROUP_ID = 'paola-sandbox@galvanize.com';
const GOOGLE_GROUP_USER = 'paola@galvanize.com';

beforeAll(async () => {
  // remove all users
  // add paola
  await jwt.authorize((err, token) => {
    if (err) return err;
    return token;
  });
  const service = await google.admin(
    { version: 'directory_v1', auth: jwt },
  );
  service.members.insert({
    groupKey: GOOGLE_GROUP_ID,
    resource: { email: GOOGLE_GROUP_USER },
  });
});

describe('getAllGroupMembers', () => {
  test('Should return an array of group members', async () => {
    const members = await getAllGroupMembers(GOOGLE_GROUP_ID);
    expect(members).toHaveLength(0);
  });
  test('Should return an empty array if no members', async () => {
    const members = await getAllGroupMembers(GOOGLE_GROUP_ID);
    expect(members).toHaveLength(0);
  });
  test('Should return an error if group id does not exist', async () => {
    const members = await getAllGroupMembers('*****');
    expect(members).toBe('Resource Not Found: groupKey');
  });
  test('Should return an error if no access to group id', async () => {
    const members = await getAllGroupMembers('googlegroups@gmail.com');
    expect(members).toBe('Not Authorized to access this resource/api');
  });
});

describe('addGroupMember', () => {
  test('Should return true if user successfully is added', async () => {
    const response = await addGroupMember(GOOGLE_GROUP_ID, GOOGLE_GROUP_USER);
    expect(response).toBe(true);
  });
  test('Should return an error if user is already in group', async () => {
    const response = await addGroupMember(GOOGLE_GROUP_ID, GOOGLE_GROUP_USER);
    expect(response).toBe('Member already exists');
  });
  test('Should return an error if user does not exist', async () => {
    const response = await addGroupMember(GOOGLE_GROUP_ID, '****');
    expect(response).toContain('Resource Not Found');
  });
});

describe('removeGroupMember', () => {
  test('Should return true if user successfully is removed', async () => {
    const response = await removeGroupMember(GOOGLE_GROUP_ID, GOOGLE_GROUP_USER);
    expect(response).toBe(true);
  });
  test('Should return an error if user was already not in group', async () => {
    const response = await removeGroupMember(GOOGLE_GROUP_ID, GOOGLE_GROUP_USER);
    expect(response).toBe('Resource Not Found: memberKey');
  });
  test('Should return an error if invalid user', async () => {
    const response = await removeGroupMember(GOOGLE_GROUP_ID, '****');
    expect(response).toBe('Missing required field: memberKey');
  });
});
