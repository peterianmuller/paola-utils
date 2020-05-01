require('dotenv').config();
const jsforce = require('jsforce');
const {
  getStudents,
} = require('.');

const SFDC_OPPTY_RECORD_ID = '012j0000000qVAP';

const conn = new jsforce.Connection({ loginUrl: process.env.SFDC_LOGIN_URL });

const queryWhere = (courseStart, courseType) => `RecordTypeId = '${SFDC_OPPTY_RECORD_ID}'
AND Course_Product__c = 'Web Development'
AND Course_Start_Date_Actual__c = ${courseStart}
AND Course_Type__c LIKE '%${courseType}%'`;

describe('getStudents', () => {
  test('Should return the expected length of array', async () => {
    await conn.login(process.env.SFDC_USERNAME, process.env.SFDC_PASSWORD,
      (err, userInfo) => userInfo);
    const studentCount = await conn.sobject('Opportunity')
      .select(`Id, Student__c, Student__r.Name,
      Student__r.Email, Student__r.Secondary_Email__c, Campus_Formatted__c,
      Student__r.Github_Username__c, Course_Start_Date_Actual__c, Product_Code__c,
      StageName, Separation_Status__c, Separation_Type__c`)
      .where(queryWhere)
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
