require('dotenv').config();
const jsforce = require('jsforce');

const conn = new jsforce.Connection({ loginUrl: process.env.SFDC_LOGIN_URL });
const SFDC_OPPTY_RECORD_ID = '012j0000000qVAP';
const QUERY_SELECT = `Id, Student__c, Student__r.Name,
Student__r.Email, Student__r.Secondary_Email__c, Campus_Formatted__c,
Student__r.Github_Username__c, Course_Start_Date_Actual__c, Product_Code__c,
StageName, Separation_Status__c, Separation_Type__c`;

// ------------------------------
// Salesforce API Integrations
// ------------------------------

const login = async () => {
  try {
    return await conn.login(
      process.env.SFDC_USERNAME,
      process.env.SFDC_PASSWORD,
      (err, userInfo) => userInfo,
    );
  } catch (error) {
    return error;
  }
};

const generateWhereClause = (courseStart, courseType) => `RecordTypeId = '${SFDC_OPPTY_RECORD_ID}'
AND Course_Product__c = 'Web Development'
AND Course_Start_Date_Actual__c = ${courseStart}
AND Course_Type__c LIKE '%${courseType}%'`;

const formatStudents = (ogData) => {
  const students = ogData.map((s) => {
    const contact = s.Student__r || {};
    const newStudent = {};
    newStudent.fullName = contact.Name;
    newStudent.email = contact.Email;
    newStudent.emailSecondary = contact.Secondary_Email__c;
    newStudent.campus = s.Campus_Formatted__c;
    newStudent.github = contact.Github_Username__c;
    newStudent.courseStartDate = s.Course_Start_Date_Actual__c;
    newStudent.productCode = s.Product_Code__c;
    newStudent.stage = s.StageName;
    newStudent.separationStatus = s.Separation_Status__c;
    newStudent.separationType = s.Separation_Type__c;
    newStudent.sfdcContactId = s.Student__c;
    newStudent.sfdcOpportunityId = s.Id;

    return newStudent;
  });
  return students;
};

exports.getStudents = async (courseStart, courseType) => {
  try {
    await login();
    return await conn.sobject('Opportunity')
      .select(QUERY_SELECT)
      .where(generateWhereClause(courseStart, courseType))
      .orderby('CreatedDate', 'DESC')
      .execute((err, res) => {
        if (err) throw new Error('SALESFORCE ERROR', err);
        const formattedStudentData = formatStudents(res);
        console.log(formattedStudentData);
        return formattedStudentData;
      });
  } catch (error) {
    return error;
  }
};
