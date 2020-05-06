require('dotenv').config();
const {
  getAllGroupMembers,
  addGroupMember,
  removeGroupMember,
} = require('.');

const GOOGLE_GROUP_ID = 'paola-sandbox@galvanize.com';
const GOOGLE_GROUP_USER = 'paola@galvanize.com';

// beforeAll(() => {
// });

describe('getAllGroupMembers', () => {
  test('Should return an array of group members', async () => {
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

describe('removeGroupMember', () => {
  test('Should return true if user successfully is removed', async () => {
    const response = await removeGroupMember(GOOGLE_GROUP_ID, GOOGLE_GROUP_USER);
    expect(response).toBe(true);
  });
  test('Should return an error if member was not in group', async () => {
    const response = await removeGroupMember(GOOGLE_GROUP_ID, GOOGLE_GROUP_USER);
    expect(response).toBe('Error: Resource Not Found: memberKey');
  });
  test('Should return an error if cannot find user to remove', async () => {
    const response = await removeGroupMember(GOOGLE_GROUP_ID, '****');
    expect(response).toBe('Error: Missing required field: memberKey');
  });
});
