import crypto from 'crypto';

export function buildSignature(content: any, secret: string) {
  return crypto
    .createHmac('sha256', secret)
    .update(content)
    .digest('hex');
}
