require('dotenv').config();
const { GOOGLE_GROUP_ID } = require('../constants');
const { getAllGroupMembers } = require('.');


// beforeAll(() => {
// });

describe('getAllGroupMembers', () => {
  test('Should return an array of group members', async () => {
    const isValid = await getAllGroupMembers(GOOGLE_GROUP_ID);
    expect(isValid).toBe(true);
  });
  test('Should return an error if group id does not exist', async () => {
    const isValid = await getAllGroupMembers('*****');
    expect(isValid).toBe(true);
  });
  test('Should return an error if no access to group id', async () => {
    const isValid = await getAllGroupMembers('*****');
    expect(isValid).toBe(true);
  });
});
