import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const ses = new SESClient({ region: 'us-east-1' });

interface EmailParams {
  Source: string;
  Destination: {
    ToAddresses: string[];
  };
  Message: {
    Subject: { Data: string };
    Body: { Text: { Data: string } };
  };
  ReplyToAddresses?: string[];
}

export const email_myself = async (
  from: string,
  subject: string,
  message: string,
  reply_to?: string
): Promise<void> => {
  const params: EmailParams = {
    Source: `${from} <messmer@cryfs.org>`,
    Destination: {
      ToAddresses: ['messmer@cryfs.org'],
    },
    Message: {
      Subject: { Data: subject },
      Body: { Text: { Data: message } },
    },
  };

  if (reply_to !== undefined && reply_to !== '') {
    params.ReplyToAddresses = [reply_to];
  }

  await ses.send(new SendEmailCommand(params));
};
