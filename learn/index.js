const fetch = require('node-fetch');
const { LEARN_API_COHORTS } = require('../constants');

const headers = {
  Authorization: `Bearer ${process.env.LEARN_TOKEN}`,
  'Content-Type': 'application/json',
};

// ------------------------------
// Learn API Integrations
// ------------------------------

// Read all students in a cohort
exports.getAllStudentsInCohort = async (cohortId) => {
  try {
    const response = await fetch(
      `${LEARN_API_COHORTS}/${cohortId}/users`,
      { headers },
    );
    const json = await response.json();
    if (json.message) throw new Error(json.message);
    return json;
  } catch (error) {
    return error.message;
  }
};

// Write a student to a cohort
exports.addStudentToCohort = async () => {

};

// Delete a student from a cohort
exports.removeStudentFromCohort = async () => {

};

// Write a new cohort
exports.createNewCohort = async (cohortObj) => {
  try {
    const response = await fetch(
      `${LEARN_API_COHORTS}`,
      { method: 'POST', body: JSON.stringify(cohortObj), headers },
    );
    const json = await response.json();
    if (json.error) throw new Error(json.error);
    return response.status;
  } catch (error) {
    return error.message;
  }
};

// TODO: Move this elsewhere! You can skip this one for now.
// Validate that a student is enrolled in a cohort
exports.validateStudentEnrollment = async () => {

};
