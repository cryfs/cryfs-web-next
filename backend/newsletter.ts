import { createHash } from 'crypto';
import mailchimp from '@mailchimp/mailchimp_marketing';
import { email_myself } from './email';
import secret from './secret';
import CachedValue from './cached_value';
import { LambdaFunction, LambdaResponse } from './lambda_function';

interface MailchimpClient {
  list_id: string;
}

interface MailchimpError {
  title?: string;
  status?: number;
  [key: string]: unknown;
}

const mailchimp_client = new CachedValue<MailchimpClient>(async () => {
  const list_id = await secret('MAILCHIMP_LIST_ID');
  const api_token = await secret('MAILCHIMP_API_TOKEN');

  // Extract server from API token (format: key-us1, key-us2, etc.)
  const server = api_token.split('-').pop() || 'us1';

  mailchimp.setConfig({
    apiKey: api_token,
    server: server,
  });

  return {
    list_id: list_id,
  };
});

const response_success: LambdaResponse = {
  statusCode: 200,
  body: JSON.stringify({
    success: true,
  }),
};

const response_error_invalid_email: LambdaResponse = {
  statusCode: 400,
  body: JSON.stringify({
    success: false,
    error: 'invalid-email',
  }),
};

const response_error_unsubscribed: LambdaResponse = {
  statusCode: 400,
  body: JSON.stringify({
    success: false,
    error: 'unsubscribed',
  }),
};

const response_error_unknown: LambdaResponse = {
  statusCode: 500,
  body: JSON.stringify({
    success: false,
  }),
};

const subscriber_hash = (email: string): string => createHash('md5').update(email.toLowerCase()).digest('hex');

const email_is_subscribed = async (email: string): Promise<boolean> => {
  const mc = await mailchimp_client.get();
  const response = await mailchimp.lists.getListMember(mc.list_id, subscriber_hash(email), {
    fields: ['status'],
  });
  return response.status === 'subscribed';
};

const resubscribe = async (email: string): Promise<void> => {
  const mc = await mailchimp_client.get();
  await mailchimp.lists.updateListMember(mc.list_id, subscriber_hash(email), {
    email_address: email,
    status: 'pending',
  });
};

const do_register = async (email: string): Promise<LambdaResponse> => {
  const mc = await mailchimp_client.get();
  try {
    await mailchimp.lists.addListMember(mc.list_id, {
      email_address: email,
      status: 'pending',
    });
  } catch (err) {
    const error = err as MailchimpError;
    if (error['title'] === 'Member Exists') {
      const is_subscribed = await email_is_subscribed(email);
      if (is_subscribed) {
        console.log(`Didn't register ${email} because it is already registered`);
        await email_myself(
          'CryFS Newsletter Registration',
          'New interested user (not adding - already exists)',
          `Didn't register ${email} with newsletter because it already exists`
        );
        return response_success;
      } else {
        await resubscribe(email);
        console.log(`${email} was unsubscribed before. Resubscribing.`);
        await email_myself(
          'CryFS Newsletter Registration',
          'New interested user (resubscribe)',
          `${email} was unsubscribed before. Resubscribing.`
        );
        return response_success;
      }
    } else if (error['title'] === 'Invalid Resource') {
      console.log(`Didn't register ${email} because it is an invalid email address`);
      await email_myself(
        'CryFS Newsletter Registration',
        'New interested user (not adding - invalid email)',
        `Didn't register ${email} with newsletter because it is an invalid email address. Error message:\n\n${JSON.stringify(err)}`
      );
      return response_error_invalid_email;
    } else if (error['title'] === 'Forgotten Email Not Subscribed') {
      console.log(`Didn't register ${email} because it was previously unsubscribed`);
      await email_myself(
        'CryFS Newsletter Registration',
        'New interested user (not adding - previously unsubscribed)',
        `Didn't register ${email} with newsletter because it was previously unsubscribed`
      );
      return response_error_unsubscribed;
    } else {
      console.log(`Didn't register ${email} with newsletter because of an error: ${JSON.stringify(err)}`);
      await email_myself(
        'CryFS Newsletter Registration',
        'Error registering user',
        `Didn't register ${email} with newsletter because of an error: ${JSON.stringify(err)}`
      );
      return response_error_unknown;
    }
  }

  await email_myself('CryFS Newsletter Registration', 'New interested user', `Registered ${email} with newsletter`);
  console.log(`Registered ${email} with newsletter`);

  return response_success;
};

export const register = LambdaFunction(async (body) => {
  return await do_register(body['email'] as string);
});
