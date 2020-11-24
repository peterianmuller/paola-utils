const fetch = require('node-fetch');
// const { SLACK_API_KEY } = require('./config.js');

// ------------------------------
// Slack API Integrations (WIP)
// ------------------------------

// NOTE: Let's save these for a future sprint. I might take on the Slack API stuff for this
//       iteration.

// Send a message to a channel
exports.sendMessageToChannel = async () => {

};

// Send a message via DM
exports.sendMessageViaDM = async () => {

};

exports.getChannelHistory = async (channelID) => {
  // console.log(req.body);
  // const { challenge } = req.body;
  // POST https://slack.com/api/chat.postMessage
  // Content-type: application/json
  // Authorization: Bearer xoxb-your-token
  // {
  //   "channel": "YOUR_CHANNEL_ID",
  //   "text": "Hello world :tada:"
  // }
  const headers = {
    Authorization: `Bearer ${process.env.SLACK_TOKEN}`,
    // 'Content-Type': 'application/x-www-form-urlencoded',
    channel: 'C01ER2NA0PR'
  };
  const body = {
    channel: 'C01ER2NA0PR',
  };
  try {
    const response = await fetch(
      `https://slack.com/api/conversations.history?token=${process.env.SLACK_TOKEN}&channel=${channelID}&limit=1000`,
      { method: 'GET', headers},
    );
    const json = await response.json();
    json.messages.forEach(async message => {
      console.log(message);
    });
    // if (json.error || json.message) throw new Error(json.error || json.message);
    // return json.status;
  } catch (err) {
    // return error.message;
    console.log(err);
  }
};

exports.deleteMessage = async (channelID, ts) => {
  // console.log(req.body);
  // const { challenge } = req.body;
  // POST https://slack.com/api/chat.postMessage
  // Content-type: application/json
  // Authorization: Bearer xoxb-your-token
  // {
  //   "channel": "YOUR_CHANNEL_ID",
  //   "text": "Hello world :tada:"
  // }
  const headers = {
    Authorization: `Bearer ${process.env.SLACK_TOKEN}`,
    'Content-Type': 'application/json',
  };
  const body = {
    channel: channelID,
    ts: ts
  };
  try {
    const response = await fetch(
      'https://slack.com/api/chat.delete',
      { method: 'POST', body: JSON.stringify(body), headers },
    );
    const json = await response.json();
    console.log(json);
    // if (json.error || json.message) throw new Error(json.error || json.message);
    // return json.status;
  } catch (err) {
    // return error.message;
    console.log(err);
  }
};




// CONFIGURATION #######################################################################################################

const token = process.env.SLACK_TOKEN;
// Legacy tokens are no more supported.
// Please create an app or use an existing Slack App
// Add following scopes in your app from "OAuth & Permissions"
//  - channels:history
//  - groups:history
//  - im:history
//  - mpim:history
//  - chat:write

// VALIDATION ##########################################################################################################


// if (token === 'SLACK TOKEN') {
//     console.error('Token seems incorrect. Please open the file with an editor and modify the token variable.');
// }

// let channel = '';
// if (process.argv[0].indexOf('node') !== -1 && process.argv.length > 2) {
//     channel = process.argv[2];
// } else if (process.argv.length > 1) {
//     channel = process.argv[1];
// } else {
//     console.log('Usage: node ./delete-slack-messages.js CHANNEL_ID');
//     process.exit(1);
// }

// GLOBALS #############################################################################################################

const https         = require('https');
const channelConfig = {
  // baseApiUrl, historyApiUrl, deleteApiUrl, repliesApiUrl, channel
}

// var baseApiUrl    = 'https://slack.com/api/';
// var historyApiUrl = `${baseApiUrl}conversations.history?token=${token}&channel=${channel}&count=1000&cursor=`;
// var deleteApiUrl  = `${baseApiUrl}chat.delete?token=${token}&channel=${channel}&ts=`;
// var repliesApiUrl = `${baseApiUrl}conversations.replies?token=${token}&channel=${channel}&ts=`
let   delay         = 300; // Delay between delete operations in milliseconds

// ---------------------------------------------------------------------------------------------------------------------


exports.fetchAndDeleteMessages = (channelID) => {
  //channel = channelID;

  channelConfig.channel = channelID;
  channelConfig.baseApiUrl    = 'https://slack.com/api/';
  channelConfig.historyApiUrl = `${channelConfig.baseApiUrl}conversations.history?token=${token}&channel=${channelConfig.channel}&count=1000&cursor=`;
  channelConfig.deleteApiUrl  = `${channelConfig.baseApiUrl}chat.delete?token=${token}&channel=${channelConfig.channel}&ts=`;
  channelConfig.repliesApiUrl = `${channelConfig.baseApiUrl}conversations.replies?token=${token}&channel=${channelConfig.channel}&ts=`;

  fetchAndDeleteMessages(null, '');
}

const sleep = delay => new Promise(r => setTimeout(r, delay));
const get   = url => new Promise((resolve, reject) =>
    https
        .get(url, res => {
            let body = ''

            res.on('data', chunk => (body += chunk))
            res.on('end', () => resolve(JSON.parse(body)))
        })
        .on('error', reject)
);

// ---------------------------------------------------------------------------------------------------------------------

async function deleteMessages(threadTs, messages) {

    if (messages.length == 0) {
        return;
    }

    const message = messages.shift();

    if (message.thread_ts !== threadTs) {
        await fetchAndDeleteMessages(message.thread_ts, ''); // Fetching replies, it will delete main message as well.
    } else {
        const response = await get(channelConfig.deleteApiUrl + message.ts);

        if (response.ok === true) {
            console.log(message.ts + (threadTs ? ' reply' : '') + ' deleted!');
        } else if (response.ok === false) {
            console.log(message.ts + ' could not be deleted! (' + response.error + ')');

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

// ---------------------------------------------------------------------------------------------------------------------

async function fetchAndDeleteMessages(threadTs, cursor) {

    const response = await get((threadTs ? channelConfig.repliesApiUrl + threadTs + '&cursor=' : channelConfig.historyApiUrl) + cursor);

    if (!response.ok) {
        console.error(response.error);
        return;
    }

    if (!response.messages || response.messages.length === 0) {
        return;
    }

    await deleteMessages(threadTs, response.messages);

    if (response.has_more) {
        await fetchAndDeleteMessages(threadTs, response.response_metadata.next_cursor);
    }
}

// ---------------------------------------------------------------------------------------------------------------------

//fetchAndDeleteMessages(null, '');

