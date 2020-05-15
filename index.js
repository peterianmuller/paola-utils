require('dotenv').config();
const GSheets = require('./googleSheets');
const GGroups = require('./googleGroups');
const GMail = require('./googleMail');
const Salesforce = require('./salesforce');
const GitHub = require('./github');
const Learn = require('./learn');
const Slack = require('./slack');

// const subjectQuery = 'precourse deadlines';
// const toList = ['paola@galvanize.com'];
// const ccList = ['murph.grainger@galvanize.com', 'paola@galvanize.com'];
// const bccList = [];
// const mergeFields = {
//   name: 'Murph',
//   deadline1: 'Nov 1, 2020',
//   deadline2: 'Nov 2, 2020',
//   deadline3: 'Nov 3, 2020',
// };
// GMail.sendEmailFromDraft(subjectQuery, toList, ccList, bccList, mergeFields);


// ------------------------------
// API Integrations
// ------------------------------
// Prerequisites and Limitations:
//
//  ⁃ Get API credentials for each API
//  ⁃ Determine rate limits of each API
//  ⁃ Make a list of required docs page links to inform each function’s implementation
//
//  TDD:
//
//  ⁃ Write tests that verify success for each function
//  ⁃ Write tests to verify successful handling of errors for each function

// TODO: Ultimately, we'll remove helloWorld. Just a test to make sure the NPM module is working :)
exports.helloWorld = () => 'Hello World, I\'m Paola!';

exports.GSheets = GSheets;
exports.GGroups = GGroups;
exports.GMail = GMail;
exports.Salesforce = Salesforce;
exports.GitHub = GitHub;
exports.Learn = Learn;
exports.Slack = Slack;
