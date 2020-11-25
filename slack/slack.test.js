require('dotenv').config();

const {
  sendMessageToChannel, clearChannel,
} = require('.');


// Clear out all messages from #delete-messages-test-channel channel in the paola-sandbox workspace
beforeAll(async () => {
  await clearChannel('C01ER2NA0PR');
});


describe('sendMessageToChannel', () => {
  test('Should send a new message to the #delete-messages-test-channel as Paola', async () => {
    const messageSent = await sendMessageToChannel('C01ER2NA0PR', 'hello');
    expect(messageSent.ok).toEqual(true);
  });
});
