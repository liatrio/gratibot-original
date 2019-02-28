# Gratibot

Gratibot is based off of [HowdyAI's Botkit](https://botkit.ai/) framework. We appreciate all the hard work they have done to give us this framework to extend.

## Local Development

If you don't already have a Slack app for testing/development create a new one
1. Goto [api.slack.com/apps](https://api.slack.com/apps).
2. Add an App Name like YOUR_NAME-bot.
3. Select a Development Slack Workspace you want to test the bot in.
4. Press the `Create App` button.

Run bot locally and expose port
1. Clone project `git clone https://github.com/liatrio/gratibot.git`
2. Edit .env file and add the client ID, client secret from the Slack app you create and set port to 3000
3. Start docker containers `docker-compose up --build`
5. Start ngrok `ngrok http 3000`

Configure the follow Slack app features settings under each menu item
1. Bot User: Set display name and default username and Save Changes
2. OAuth & permission: Add a redirect URL which points to the ngrok forward `https://NGROK_HOST/oauth`
3. Event Subscriptions: Enable events, Set Request URL to ngrok forward `https://NGROK_HOST/slack/receive` and add bot events for `message.channels`, `message.groups`, `message.im`, `message.mpim`.

Connect bot to Slack
1. Goto [https://NGROK_HOST:3000/](https://NGROK_HOST:3000/) and follow instructions to add bot to Slack.


## AWS Manual/Admin Requirements 
The infrastructure code cannot be set up without the appropriate security pieces in place include:
* KMS key for the parameters
* Parameter store set up for slack credentials (clientId, clientSecret, clientSigningSecret)
* IAM Role to allow ECS task to utilize the parameters and key

This can be done manually or via the `infra_admin` Terraform configuration. This must be run by someone with the ability to create roles, keys, and parameters. 

For more information on the AWS Requirements check out [The ECS Docs](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/specifying-sensitive-data.html#secrets-create-taskdefinition)

