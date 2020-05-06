require('dotenv').config();
const { getAllGroupMembers } = require('.');

const GOOGLE_GROUP_ID = 'paola-sandbox@galvanize.com';

// beforeAll(() => {
// });

describe('getAllGroupMembers', () => {
  test('Should return an array of group members', async () => {
    const members = await getAllGroupMembers(GOOGLE_GROUP_ID);
    expect(members).toHaveLength(2);
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
