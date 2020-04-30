require('dotenv').config();
const jsforce = require('jsforce');

const { QUERY_SELECT, QUERY_WHERE, DATA_REFORMAT } = require('./query-mapping');
const conn = new jsforce.Connection({ loginUrl: process.env.SFDC_LOGIN_URL });

// ------------------------------
// Salesforce API Integrations
// ------------------------------

const login = async () => {
  try {
    return await conn.login(process.env.SFDC_USERNAME, process.env.SFDC_PASSWORD,
      (err, userInfo) => userInfo);
  } catch (error) {
    return error;
  }
};

exports.getStudents = async () => {
  try {
    await login();
    return await conn.sobject('Opportunity')
      .select(QUERY_SELECT)
      .where(QUERY_WHERE)
      .orderby('CreatedDate', 'DESC')
      .execute((err, res) => {
        if (err) throw new Error('SALESFORCE ERROR', err);
        const formattedStudentData = DATA_REFORMAT(res);
        return formattedStudentData;
      });
  } catch (error) {
    return error;
  }
};
