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
    if (json.error || json.message) throw new Error(json.error || json.message);
    return json;
  } catch (error) {
    return error.message;
  }
};

// Write a student to a cohort
exports.addStudentToCohort = async (cohortId, student) => {
  try {
    const response = await fetch(
      `${LEARN_API_COHORTS}/${cohortId}/users`,
      { method: 'POST', body: JSON.stringify(student), headers },
    );
    const json = await response.json();
    if (json.error || json.message) throw new Error(json.error || json.message);
    return json.status;
  } catch (error) {
    return error.message;
  }
};

// Validate that a student is enrolled in a cohort
exports.validateStudentEnrollment = async (cohortId, email) => {
  try {
    const students = await exports.getAllStudentsInCohort(cohortId);
    if (!Array.isArray(students)) throw new Error(students);
    const activeStudent = students.find((s) => s.email === email);
    if (!activeStudent) throw new Error('No active student found with provided email.');
    return activeStudent;
  } catch (error) {
    return error.message;
  }
};

// Delete a student from a cohort
exports.removeStudentFromCohort = async (cohortId, email) => {
  try {
    const students = await exports.getAllStudentsInCohort(cohortId);
    if (!Array.isArray(students)) throw new Error(students);
    const activeStudent = students.find((s) => s.email === email);
    if (!activeStudent) throw new Error('No active student found with provided email.');
    const response = await fetch(
      `${LEARN_API_COHORTS}/${cohortId}/users/${activeStudent.id}`,
      { method: 'DELETE', headers },
    );
    const json = await response.json();
    if (json.error || json.message) throw new Error(json.error || json.message);
    return json.status;
  } catch (error) {
    return error.message;
  }
};

// Write a new cohort
exports.createNewCohort = async (cohortObj) => {
  try {
    const response = await fetch(
      `${LEARN_API_COHORTS}`,
      { method: 'POST', body: JSON.stringify(cohortObj), headers },
    );
    const json = await response.json();
    if (json.error || json.message) throw new Error(json.error || json.message);
    return response.status;
  } catch (error) {
    return error.message;
  }
};
