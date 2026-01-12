import { SSMClient, GetParametersCommand } from '@aws-sdk/client-ssm';
import CachedValue from './cached_value';

const ssm = new SSMClient();

const keys = ['MAILCHIMP_API_TOKEN', 'MAILCHIMP_LIST_ID'] as const;

type SecretKey = (typeof keys)[number];
type SecretValues = Record<SecretKey, string>;

const load_values = async (): Promise<SecretValues> => {
  const validate = (keys: readonly string[], params: Record<string, string>): void => {
    const missing = keys.filter((k) => params[k] === undefined);
    if (missing.length > 0) {
      throw new Error(`missing keys: ${missing.join(', ')}`);
    }
  };

  const command = new GetParametersCommand({
    Names: [...keys],
    WithDecryption: true,
  });
  const resp = await ssm.send(command);

  const params: Record<string, string> = {};
  for (const p of resp.Parameters || []) {
    if (p.Name && p.Value) {
      params[p.Name] = p.Value;
    }
  }

  validate(keys, params);
  return params as SecretValues;
};

const secrets = new CachedValue(load_values);

export default async (key: SecretKey): Promise<string> => {
  const secret_values = await secrets.get();
  return secret_values[key];
};
