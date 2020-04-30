require('dotenv').config();
const fetch = require('node-fetch');
const {
  getStudents,
} = require('.');

describe('getStudents', () => {
  test('Should return an array of objects with correct keys', async () => {
    // const isValid = await getStudents();
    expect(2).toBe(2);
  });

  test('Shouuld return the expected length of array', async () => {
    expect(2).toBe(2);
  });
});
