const fetch = require('node-fetch');
const https = require('https');

const apiConfig = {};
const token = process.env.SLACK_TOKEN;
let delay = 300;


// ------------------------------
// Slack API Integrations (WIP)
// ------------------------------

// NOTE: Let's save these for a future sprint. I might take on the Slack API stuff for this
//       iteration.

// Send a message to a channel
exports.sendMessageToChannel = async (channel, text) => {
  const headers = {
    Authorization: `Bearer ${process.env.SLACK_TOKEN}`,
    'Content-Type': 'application/json; charset=utf-8',
  };
  const body = {
    channel,
    text,
  };
  try {
    const response = await fetch(
      'https://slack.com/api/chat.postMessage',
      { method: 'POST', body: JSON.stringify(body), headers },
    );
    const json = await response.json();
    return json.status;
  } catch (err) {
    return err;
  }
};

// TODO Send a message via DM
exports.sendMessageViaDM = async () => {

};

// get history of messages from a channel.
exports.getChannelHistory = async (channelID) => {
  const headers = {
    Authorization: `Bearer ${process.env.SLACK_TOKEN}`,
    // 'Content-Type': 'application/x-www-form-urlencoded',
    channel: 'C01ER2NA0PR',
  };
  try {
    const response = await fetch(
      `https://slack.com/api/conversations.history?token=${process.env.SLACK_TOKEN}&channel=${channelID}&limit=1000`,
      { method: 'GET', headers },
    );
    return response;
  } catch (err) {
    return err;
  }
};

// CONFIGURATION

// Legacy tokens are no more supported.
// Please create an app or use an existing Slack App
// Add following scopes in your app from "OAuth & Permissions"
//  - channels:history
//  - groups:history
//  - im:history
//  - mpim:history
//  - chat:write

// VALIDATION

const sleep = (delayTime) => new Promise((r) => setTimeout(r, delayTime));
const get = (url) => new Promise((resolve, reject) => https.get(url, (res) => {
  let body = '';
  res.on('data', (chunk) => {
    (body += chunk);
  });
  res.on('end', () => resolve(JSON.parse(body)));
})
  .on('error', reject));

async function deleteMessages(threadTs, messages) {
  if (messages.length === 0) {
    return;
  }

  const message = messages.shift();

  if (message.thread_ts !== threadTs) {
    await fetchAndDeleteMessages(message.thread_ts, ''); // Fetching replies, it will delete main message as well.
  } else {
    const response = await get(apiConfig.deleteApiUrl + message.ts);

    if (response.ok === false) {
      if (response.error === 'ratelimited') {
        await sleep(1000);
        delay += 100; // If rate limited error caught then we need to increase delay.
        messages.unshift(message);
      }
    }
  }

  await sleep(delay);
  await deleteMessages(threadTs, messages);
}


async function fetchAndDeleteMessages(threadTs, cursor) {
  const response = await get((threadTs ? `${apiConfig.repliesApiUrl + threadTs}&cursor=` : apiConfig.historyApiUrl) + cursor);

  if (!response.ok) {
    return response;
  }

  if (!response.messages || response.messages.length === 0) {
    return response;
  }

  await deleteMessages(threadTs, response.messages);

  if (response.has_more) {
    await fetchAndDeleteMessages(threadTs, response.response_metadata.next_cursor);
  }
}

exports.clearChannel = (channelID) => {
  apiConfig.channel = channelID;
  apiConfig.baseApiUrl = 'https://slack.com/api/';
  apiConfig.historyApiUrl = `${apiConfig.baseApiUrl}conversations.history?token=${token}&channel=${apiConfig.channel}&count=1000&cursor=`;
  apiConfig.deleteApiUrl = `${apiConfig.baseApiUrl}chat.delete?token=${process.env.SLACK_TOKEN_USER}&channel=${apiConfig.channel}&ts=`;
  apiConfig.repliesApiUrl = `${apiConfig.baseApiUrl}conversations.replies?token=${token}&channel=${apiConfig.channel}&ts=`;
  fetchAndDeleteMessages(null, '');
};
