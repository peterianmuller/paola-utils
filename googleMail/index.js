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

const getDraftBySubject = async (subjectQuery) => {
  // get list of drafts with query keyword
  const service = await authenticate();
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
  return draft.data;
};

const populateMergeFields = (body, subject, mergeFields) => {
  // TODO: error handle to make sure mergeFields params match what email expects
  if (!mergeFields) return { body, subject };
  let mergedBody = body;
  let mergedSubject = subject;
  Object.entries(mergeFields).map((obj) => {
    mergedBody = mergedBody.replace(`{{${obj[0]}}}`, `${obj[1]}`);
    mergedSubject = mergedSubject.replace(`{{${obj[0]}}}`, `${obj[1]}`);
    return { mergedBody, mergedSubject };
  });
  return { mergedBody, mergedSubject };
};

const generateEmail = (body, subject, toList, ccList, bccList, alias, mergeFields) => {
  const fromAlias = alias ? `From: ${alias.name} <${alias.email}>` : 'From:';
  const { mergedBody, mergedSubject } = populateMergeFields(body, subject, mergeFields);
  const utf8Subject = `=?utf-8?B?${Buffer.from(mergedSubject).toString('base64')}?=`;
  const messageParts = [
    `To:  ${toList}`,
    `Cc:  ${ccList}`,
    `Bcc: ${bccList}`,
    fromAlias,
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
exports.sendEmail = async (body, subject, toList, ccList, bccList, alias, mergeFields) => {
  try {
    const service = await authenticate();
    const encodedEmail = generateEmail(
      body, subject, toList, ccList, bccList, alias, mergeFields,
    );
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

// Send an email using a draft email template
exports.sendEmailFromDraft = async (subjectQuery, toList, ccList, bccList, alias, mergeFields) => {
  try {
    const service = await authenticate();
    const draft = await getDraftBySubject(subjectQuery);
    if (draft.message.payload.parts[1].body.attachmentId) {
      throw new Error('Cannot send attachment with this method.');
    }

    // parse draft subject and body and merge fields
    const { headers } = draft.message.payload;
    const subject = headers.find((item) => item.name === 'Subject').value;
    const { data } = draft.message.payload.parts[1].body;
    const body = Buffer.from(data, 'base64').toString('utf8');
    const encodedEmail = generateEmail(
      body, subject, toList, ccList, bccList, alias, mergeFields,
    );

    // send email
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
