require('dotenv').config();
const jsforce = require('jsforce');
const { SFDC_SELECT_QUERY, SFDC_TEST_WHERE_QUERY } = require('../constants');
const { getStudents } = require('.');

const TEST_COURSE_START = '2020-05-11';
const TEST_COURSE_TYPE = '12 Week';
let studentData = [];

beforeAll(async () => {
  const conn = await new jsforce.Connection({ loginUrl: process.env.SFDC_LOGIN_URL });
  await conn.login(
    process.env.SFDC_USERNAME,
    process.env.SFDC_PASSWORD,
    (err, userInfo) => userInfo,
  );
  return conn.sobject('Opportunity')
    .select(SFDC_SELECT_QUERY)
    .where(SFDC_TEST_WHERE_QUERY)
    .orderby('CreatedDate', 'DESC')
    .execute((err, res) => {
      studentData = res;
    });
});

describe('getStudents', () => {
  test('Should return the expected length of array', async () => {
    const students = await getStudents(TEST_COURSE_START, TEST_COURSE_TYPE);
    expect(students).toHaveLength(studentData.length);
  });

  test('Should return an array of objects with correct keys', async () => {
    const expectedProps = [
      'fullName',
      'email',
      'emailSecondary',
      'campus',
      'github',
      'courseStartDate',
      'productCode',
      'stage',
      'separationStatus',
      'separationType',
      'sfdcContactId',
      'sfdcOpportunityId',
    ];
    const students = await getStudents(TEST_COURSE_START, TEST_COURSE_TYPE);
    const actualProps = Object.keys(students[0]);
    expect(actualProps).toEqual(expectedProps);
  });
});
