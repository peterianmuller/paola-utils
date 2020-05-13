// ------------------------------
// GMail API Integrations
// ------------------------------

const { google } = require('googleapis');
const key = require('../../google/gmail_client_secret.json');

const scopes = ['https://mail.google.com/'];
const jwt = new google.auth.JWT(key.client_email, null, key.private_key, scopes, 'paola@galvanize.com');

const authenticate = async () => {
  await jwt.authorize((err, token) => {
    if (err) return err;
    return token;
  });

  return google.gmail(
    { version: 'v1', auth: jwt },
  );
};

const populateMergeFields = (body, mergeFields) => {
  let mergedBody = body;
  mergedBody = mergedBody.replace('{{name}}', 'Murph');
  mergedBody = mergedBody.replace('{{section1-deadline}}', 'Jan 1, 2020 at 5pm');
  mergedBody = mergedBody.replace('{{section2-deadline}}', 'July 4, 2021 at 12pm');
  mergedBody = mergedBody.replace('{{section3-deadline}}', 'December 25, 2021 at 1am');
  return mergedBody;
};

const generateEmail = (body, subject, toList, ccList, bccList, mergeFields) => {
  const mergedBody = populateMergeFields(body, mergeFields);
  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
  const messageParts = [
    `To:  ${toList}`,
    `Cc:  ${ccList}`,
    `Bcc: ${bccList}`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${utf8Subject}`,
    '',
    `${mergedBody}`,
  ];
  const message = messageParts.join('\n');
  const encodedMessage = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return encodedMessage;
};

// Send an email with TO, CC, and BCC list of receipients attached
exports.sendEmail = async (body, subject, to, cc, bcc) => {
  try {
    const service = await authenticate();
    const encodedEmail = await generateEmail(body, subject, to, cc, bcc);
    const res = await service.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedEmail,
      },
    });
    return res.status === 200;
  } catch (error) {
    return error.message;
  }
};

// Send an email ^like^this^ using a draft email template
exports.sendEmailFromDraft = async (subjectQuery, toList, ccList, bccList) => {
  try {
    const service = await authenticate();

    // get list of drafts with query keyword
    const allDrafts = await service.users.drafts.list({
      userId: 'me',
      q: `subject:${subjectQuery}`,
    });

    // query error handling
    if (!allDrafts.data.drafts) throw new Error('No draft found.');

    if (allDrafts.data.drafts.length > 1) {
      throw new Error('More than one draft found! Please refine query.');
    }

    // get message content for draft with id from allDrafts
    const draft = await service.users.drafts.get({
      userId: 'me',
      id: allDrafts.data.drafts[0].id,
      format: 'full',
    });

    // parse draft subject and body and merge fields
    const { headers } = draft.data.message.payload;
    const subject = headers.find((item) => item.name === 'Subject').value;
    const { data } = draft.data.message.payload.parts[1].body;
    const body = Buffer.from(data, 'base64').toString('utf8');
    const encodedEmail = generateEmail(body, subject, toList, ccList, bccList);
    // send email
    const res = await service.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedEmail,
      },
    });
    console.log(res);
    return res.status === 200;
  } catch (error) {
    console.log(error);
    return error.message;
  }
};

// Send an email using a draft email template with variables in draft filled
exports.sendEmailFromDraftWithVars = async () => {

};
