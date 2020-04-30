require('dotenv').config();
const jsforce = require('jsforce');
const {
  getStudents,
} = require('.');

const conn = new jsforce.Connection({ loginUrl: process.env.SFDC_LOGIN_URL });
const { QUERY_SELECT, QUERY_WHERE } = require('./query-mapping');

describe('getStudents', () => {
  test('Should return the expected length of array', async () => {
    await conn.login(process.env.SFDC_USERNAME, process.env.SFDC_PASSWORD,
      (err, userInfo) => userInfo);
    const studentCount = await conn.sobject('Opportunity')
      .select(QUERY_SELECT)
      .where(QUERY_WHERE)
      .orderby('CreatedDate', 'DESC')
      .execute((err, res) => res);
    const students = await getStudents();
    expect(students).toHaveLength(studentCount.length);
  });

  test('Should return an array of objects with correct keys', async () => {
    const students = await getStudents();
    expect(students[0]).toHaveProperty('fullName');
    expect(students[0]).toHaveProperty('email');
    expect(students[0]).toHaveProperty('emailSecondary');
    expect(students[0]).toHaveProperty('campus');
    expect(students[0]).toHaveProperty('github');
    expect(students[0]).toHaveProperty('courseStartDate');
    expect(students[0]).toHaveProperty('productCode');
    expect(students[0]).toHaveProperty('stage');
    expect(students[0]).toHaveProperty('separationStatus');
    expect(students[0]).toHaveProperty('separationType');
    expect(students[0]).toHaveProperty('sfdcContactId');
    expect(students[0]).toHaveProperty('sfdcOpportunityId');
  });
});
