import { IncomingWebhook } from '@slack/webhook';

const webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);

export const errorHandling = ({ title, body }) => {
  webhook.send({
    attachments: [
      {
        color: '#CC0000',
        title,
        text: body,
      },
    ],
  });
};

export const logHandling = (title, message) => {
  webhook.send({
    attachments: [
      {
        color: '#008D00',
        title: title,
        text: message && `\`\`\`\n${message}\n\`\`\``,
        mrkdwn_in: ['text'],
      },
    ],
  });
};
