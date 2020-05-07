// ------------------------------
// GMail API Integrations
// ------------------------------

const { google } = require('googleapis');
const key = require('../../google/gmail_client_secret.json');

const scopes = ['https://mail.google.com/'];
const jwt = new google.auth.JWT(key.client_email, null, key.private_key, scopes, 'paola@galvanize.com');

const auth = async () => {
  await jwt.authorize((err, token) => {
    if (err) return err;
    return token;
  });

  return google.gmail(
    { version: 'v1', auth: jwt },
  );
};

// Send an email with TO, CC, and BCC list of receipients attached
exports.sendEmail = async () => {
  const toList = ['paola@galvanize.com'];
  const ccList = ['murph.grainger@galvanize.com', 'paola@galvanize.com'];
  const bccList = [];
  const subject = '🤘 Testing Yet Again 2! 🤘';
  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
  const messageParts = [
    `To:  ${toList}`,
    `Cc:  ${ccList}`,
    `Bcc: ${bccList}`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${utf8Subject}`,
    '',
    'This showing someone another test! So... <b>hi!</b>  🤘😎',
  ];
  const message = messageParts.join('\n');
  const encodedMessage = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  try {
    const service = await auth();
    const res = await service.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });
    console.log(res.status);
    return res.status === 200;
  } catch (error) {
    console.log(error);
    return error.message;
  }
};

// Send an email ^like^this^ using a draft email template
exports.sendEmailFromDraft = async () => {
  try {
    const service = await auth();

    // get list of drafts with query keyword
    const allDrafts = await service.users.drafts.list({
      userId: 'me',
      q: 'subject:precourse deadlines',
    });
    if (allDrafts.data.drafts.length > 1) throw new Error('More than one email draft found! Please refine your query.');

    // get message content for draft with id from allDrafts
    const draft = await service.users.drafts.get({
      userId: 'me',
      id: allDrafts.data.drafts[0].id,
      format: 'full',
    });

    // parse draft subject and body and merge fields
    const { headers } = draft.data.message.payload;
    const subject = headers.find((item) => item.name === 'Subject').value;
    const utf8Subject = `=?utf-8?B?${subject}?=`;
    const { data } = draft.data.message.payload.parts[1].body;
    let body = Buffer.from(data, 'base64').toString('utf8');
    body = body.replace('{{name}}', 'Murph');
    body = body.replace('{{section1-deadline}}', 'Jan 1, 2020 at 5pm');
    body = body.replace('{{section2-deadline}}', 'July 4, 2021 at 12pm');
    body = body.replace('{{section3-deadline}}', 'December 25, 2021 at 1am');
    const toList = ['paola@galvanize.com'];
    const ccList = ['murph.grainger@galvanize.com', 'paola@galvanize.com'];
    const bccList = [];
    const messageParts = [
      `To:  ${toList}`,
      `Cc:  ${ccList}`,
      `Bcc: ${bccList}`,
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: ${utf8Subject}`,
      '',
      `${body}`,
    ];
    const message = messageParts.join('\n');
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    // send email
    const sendEmail = await service.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });
    return sendEmail.status === 200;
  } catch (error) {
    return error.message;
  }
};

// Send an email using a draft email template with variables in draft filled
exports.sendEmailFromDraftWithVars = async () => {

};
