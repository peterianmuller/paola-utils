const QUERY_SELECT = `Id, Student__c, Student__r.Name,
Student__r.Email, Student__r.Secondary_Email__c, Campus_Formatted__c,
Student__r.Github_Username__c, Course_Start_Date_Actual__c, Product_Code__c,
StageName, Separation_Status__c, Separation_Type__c`;

const QUERY_WHERE = `(StageName = 'Accepted' OR StageName='Deposit Paid')
AND Course_Product__c = 'Web Development'
AND Course_Start_Date_Actual__c > TODAY`;

const DATA_REFORMAT = (ogData) => {
  const students = [];
  ogData.forEach((s) => {
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

    students.push(newStudent);
  });
  return students;
};

module.exports = {
  QUERY_WHERE,
  QUERY_SELECT,
  DATA_REFORMAT,
};
