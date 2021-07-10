import crypto from 'crypto';

function randomBytes(bytes: number) {
  return crypto.randomBytes(bytes).toString('hex');
}

/**
 * @return {string}
 */
export function generateUUID() {
  return `${randomBytes(4)}-${randomBytes(2)}-${randomBytes(2)}-${randomBytes(2)}-${randomBytes(6)}`;
}

