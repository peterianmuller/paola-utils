# paola-utils
A module of utility functions shared amongst the rest of the Paola codebase



## Salesforce
Query students from Salesforce based on Course Start and Course Type.

Course Start is required to be in 'YYYY-MM-DD' string format.
Course Type is a like query so you can do "12 Week Full-Time Immersive", "12 Week", "Full-Time", or "Immersive"
Ex: Salesforce.getStudents('2020-05-11', '12 Week') --> will get you all SEI students for the May start who are Accepted Students.


## Learn

#### Usage
`Learn.METHOD(params)`

#### Methods

##### `getAllStudentsInCohort(cohortId)`
- Gets all users enrolled in a cohort.
- Requires Cohort ID parameter.
- Returns array of user objects.
- Returns an error if invalid Cohort Id is supplied.


##### `addStudentToCohort(cohortId, options)`
- Adds a student to cohort of choice.
- Requires Cohort ID and an options parameter that represents the student being added. Ex: 2022
- Student to add requires: `first_name`, `last_name`, `email` properties
- Additional optional properties allowed - refer to [Learn API Docs](https://learn-2.galvanize.com/api/docs#enrollments-creating-a-user-and-their-enrollment)

```
const options = {
  first_name: 'Paola',
  last_name: 'Precourse',
  email: 'paola@galvanize.com',
};
```

##### `validateStudentEnrollment(cohortId, email)`
- Looks to see if student is enrolled in cohort.
- Requires Cohort ID and email parameters.
- Email parameter is used to see if student is within cohort.
- If student is in cohort - student's data is returned.
- If no student is found in cohort an error is returned.


##### `removeStudentFromCohort(cohortId, email)`
- Removes a student from a cohort based on email provided.
- Required Cohort ID and student email params.
- Returns "ok" status if successfully removed student from cohort.
- _Note: This function first queries to get the student's ID from their email. Then deletes the student with that ID. If we will be storing the student's Learn ID we can remove the initial email query step._

##### `createNewCohort(options)`
- accepts an object with required properties.
- creates a new cohort in Learn
- Additional optional properties allowed - refer to [Learn API Docs](https://learn-2.galvanize.com/api/docs#cohorts)

```
const options = {
  name: 'Paola Test Cohort',
  product_type: 'SEI Precourse',
  starts_on: '2020-10-10',
  label: '20-06-SEI-PRE', <-- not required but best practice
  campus_name: 'Remote', <-- not required but best practice
  ends_on: '2021-01-10', <-- not required but best practice
};
```
