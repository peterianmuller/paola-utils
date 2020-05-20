require('dotenv').config();
const fetch = require('node-fetch');
const { LEARN_API_COHORTS } = require('../constants');

const {
  getAllStudentsInCohort,
  addStudentToCohort,
  removeStudentFromCohort,
  createNewCohort,
  validateStudentEnrollment
} = require('.');

const headers = { Authorization: `Bearer ${process.env.LEARN_TOKEN}` };
const LEARN_COHORT_ID = 1997;
const TEST_STUDENT = {
  first_name: 'Paola',
  last_name: 'Precourse',
  email: 'paola@galvanize.com',
};

const getStudents = async () => {
  const response = await fetch(
    `${LEARN_API_COHORTS}/${LEARN_COHORT_ID}/users`,
    { headers },
  );
  return response.json();
};

describe('getAllStudentsInCohort', () => {
  test('Should expect an array of students', async () => {
    const testStudents = await getStudents();
    const students = await getAllStudentsInCohort(LEARN_COHORT_ID);
    expect(students).toHaveLength(testStudents.length);
  });

  test('Should expect an error if the cohortId provided is invalid', async () => {
    const students = await getAllStudentsInCohort(0);
    expect(students).toBe('The requested resource could not be found');
  });
});

describe('addStudentToCohort', () => {
  test('Should expect an ok status if successfully added student to cohort', async () => {
    const status = await addStudentToCohort(LEARN_COHORT_ID, TEST_STUDENT);
    expect(status).toBe('ok');
  });

  test('Should expect an already-exists status if student already exists in cohort', async () => {
    const status = await addStudentToCohort(LEARN_COHORT_ID, TEST_STUDENT);
    expect(status).toBe('already-exists');
  });

  test('Should expect an error if the cohortId provided is invalid', async () => {
    const status = await addStudentToCohort(0, TEST_STUDENT);
    expect(status).toBe('The requested resource could not be found');
  });

  test('Should expect an error if the student parameters are invalid', async () => {
    const status = await addStudentToCohort(LEARN_COHORT_ID, { name: 'paola' });
    expect(status).toContain('Validation Error');
  });
});

describe('validateStudentEnrollment', () => {
  test('Should expect a student object if student is in cohort', async () => {
    const expectedProps = [
      'id',
      'uid',
      'first_name',
      'last_name',
      'email',
      'roles',
    ];
    const student = await validateStudentEnrollment(LEARN_COHORT_ID, TEST_STUDENT.email);
    const actualProps = Object.keys(student);
    expect(actualProps).toEqual(expectedProps);
  });

  test('Should expect an error if student is not found in cohort', async () => {
    const status = await validateStudentEnrollment(LEARN_COHORT_ID, '***@test.com');
    expect(status).toBe('No active student found with provided email.');
  });

  test('Should expect an error if the cohortId provided is invalid', async () => {
    const status = await validateStudentEnrollment(0, TEST_STUDENT.email);
    expect(status).toBe('The requested resource could not be found');
  });
});

describe('removeStudentFromCohort', () => {
  test('Should expect an ok status if successfully removed student from cohort', async () => {
    const status = await removeStudentFromCohort(LEARN_COHORT_ID, TEST_STUDENT.email);
    expect(status).toBe('ok');
  });

  test('Should expect an error if student is not found in cohort', async () => {
    const status = await removeStudentFromCohort(LEARN_COHORT_ID, TEST_STUDENT.email);
    expect(status).toBe('No active student found with provided email.');
  });

  test('Should expect an error if the cohortId provided is invalid', async () => {
    const status = await removeStudentFromCohort(0, TEST_STUDENT.email);
    expect(status).toBe('The requested resource could not be found');
  });
});

// TODO: Mock this test to not create a cohort in Learn Prod
// describe('createNewCohort', () => {
//   test('Should expect a 200 status if successfull', async () => {
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
