# Gratibot

Gratibot is based off of [HowdyAI's Botkit](https://botkit.ai/) framework. We appreciate all the hardwork they have done to give us this framework to extend.

## Local Development

If you don't already have a Slack app for testing/development create a new one
1. Goto [api.slack.com/apps](https://api.slack.com/apps).
2. Add an App Name like YOUR_NAME-bot.
3. Select a Development Slack Workspace you want to test the bot in.
4. Press the `Create App` button.

Run bot locally and connect it to Slack
1. Clone project `git clone https://github.com/liatrio/gratibot.git`
2. Edit .env file and add the client ID, client secret from the Slack app you create and set port to 3000
3. Build Docker image `docker build -t gratibot`
4. Run Docker container `docker run -p 3000:3000 gratibot`
5. Goto [http://localhost:3000/](http://localhost:3000/) and follow instructions to add bot to Slack.

Event Subscriptions
1. Start ngrok `ngrok http 3000`
2. Add ngrok URL followed by /slack/receive to Request URL
3. Under Subscribe to Bot Events click Add Bot User Event
