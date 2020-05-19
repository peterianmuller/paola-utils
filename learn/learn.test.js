require('dotenv').config();
const fetch = require('node-fetch');
const { LEARN_API_COHORTS } = require('../constants');

const {
  getAllStudentsInCohort,
} = require('.');

const headers = { Authorization: `Bearer ${process.env.LEARN_TOKEN}` };
const LEARN_COHORT_ID = 1997;

const getStudents = async () => {
  const response = await fetch(
    `${LEARN_API_COHORTS}/${LEARN_COHORT_ID}/users`,
    { headers },
  );
  return response.json();
};

describe('getAllStudentsInCohort', () => {
  test('Should return an array of students', async () => {
    const testStudents = await getStudents();
    const students = await getAllStudentsInCohort(LEARN_COHORT_ID);
    expect(students).toHaveLength(testStudents.length);
  });

  test('Should return an error if the cohortId provided is invalid', async () => {
    const students = await getAllStudentsInCohort(0);
    expect(students).toBe('The requested resource could not be found');
  });
});
