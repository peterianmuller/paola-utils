require('dotenv').config();
const jsforce = require('jsforce');
const { SFDC_OPPTY_RECORD_ID, SFDC_SELECT_QUERY } = require('../constants');
const { getStudents } = require('.');

const conn = new jsforce.Connection({ loginUrl: process.env.SFDC_LOGIN_URL });
const generateWhereClause = (courseStart, courseType) => `RecordTypeId =
'${SFDC_OPPTY_RECORD_ID}' AND Course_Product__c = 'Web Development'
AND Course_Start_Date_Actual__c = ${courseStart}
AND Course_Type__c LIKE '%${courseType}%'`;

const TEST_COURSE_START = '2020-05-11';
const TEST_COURSE_TYPE = '12 Week';
let studentData = [];

beforeAll(async () => {
  await conn.login(
    process.env.SFDC_USERNAME,
    process.env.SFDC_PASSWORD,
    (err, userInfo) => userInfo,
  );
  return conn.sobject('Opportunity')
    .select(SFDC_SELECT_QUERY)
    .where(generateWhereClause(TEST_COURSE_START, TEST_COURSE_TYPE))
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
    const expectedProps = ['fullName', 'email', 'emailSecondary', 'campus', 'github', 'courseStartDate', 'productCode', 'stage', 'separationStatus', 'separationType', 'sfdcContactId', 'sfdcOpportunityId'];
    const students = await getStudents(TEST_COURSE_START, TEST_COURSE_TYPE);
    const actualProps = Object.keys(students[0]);
    expect(actualProps).toEqual(expectedProps);
  });
});
