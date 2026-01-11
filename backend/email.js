"use strict";

import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const ses = new SESClient({ region: "us-east-1" });

export const email_myself = async (from, subject, message, reply_to = undefined) => {
    const params = {
        Source: `${from} <messmer@cryfs.org>`,
        Destination: {
            ToAddresses: ["messmer@cryfs.org"],
        },
        Message: {
            Subject: { Data: subject },
            Body: { Text: { Data: message } },
        },
    };

    if (typeof reply_to !== 'undefined' && reply_to !== '') {
        params.ReplyToAddresses = [reply_to];
    }

    await ses.send(new SendEmailCommand(params));
};
