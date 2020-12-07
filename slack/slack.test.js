require('dotenv').config();

const {
  sendMessageToChannel
} = require('.');

describe('sendMessageToChannel', () => {
  test('Should send a new message to the #delete-messages-test-channel as Paola', async () => {
    const messageSent = await sendMessageToChannel('C01ER2NA0PR', 'please translate the last message with https://rot13.com/');
    expect(messageSent.ok).toEqual(true);
  });
});
