const fetch = require('node-fetch');
require('dotenv').config();

// Send a message to a channel
exports.sendMessageToChannel = async (channel, text) => {
  const headers = {
    Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
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
    return json;
  } catch (err) {
    return err;
  }
};
