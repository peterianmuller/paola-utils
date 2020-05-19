require('dotenv').config();
const fetch = require('node-fetch');
const { LEARN_API_COHORTS } = require('../constants');

const {
  getAllStudentsInCohort,
  createNewCohort,
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

// Dont think we should create cohorts when testing then delete
// describe('createNewCohort', () => {
//   test('Should return a 200 status if successfull', async () => {
//     const body = {
//       name: 'Paola Test Cohort (FROM API TEST)',
//       product_type: 'SEI Precourse',
//       label: '20-06-SEI-PRE',
//       campus_name: 'Remote',
//       starts_on: '2020-10-10',
//       ends_on: '2021-01-10',
//     };
//     const status = await createNewCohort(body);
//     expect(status).toBe(200);
//   });
//
//   test('Should return an error if the cohortId provided is invalid', async () => {
//     const students = await createNewCohort(0);
//     expect(students).toContain('Validation Error');
//   });
// });
