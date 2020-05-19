# paola-utils
A module of utility functions shared amongst the rest of the Paola codebase



### Salesforce
Query students from Salesforce based on Course Start and Course Type.

Course Start is required to be in 'YYYY-MM-DD' string format.
Course Type is a like query so you can do "12 Week Full-Time Immersive", "12 Week", "Full-Time", or "Immersive"
Ex: Salesforce.getStudents('2020-05-11', '12 Week') --> will get you all SEI students for the May start who are Accepted Students.


### Learn

createNewCohort accepts an object with specific properties.  See example:
```
const body = {
  name: 'Paola Test Cohort',
  product_type: 'SEI Precourse',
  label: '20-06-SEI-PRE',
  campus_name: 'Remote',
  starts_on: '2020-10-10',
  ends_on: '2021-01-10',
};
```
