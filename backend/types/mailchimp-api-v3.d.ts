declare module 'mailchimp-api-v3' {
  interface MailchimpRequest {
    path: string;
    body?: Record<string, unknown>;
  }

  interface MailchimpMemberResponse {
    id?: string;
    status?: string;
    [key: string]: unknown;
  }

  class Mailchimp {
    constructor(apiKey: string);
    get(request: MailchimpRequest): Promise<MailchimpMemberResponse>;
    post(request: MailchimpRequest): Promise<MailchimpMemberResponse>;
    put(request: MailchimpRequest): Promise<MailchimpMemberResponse>;
  }

  export default Mailchimp;
}
