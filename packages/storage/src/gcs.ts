import * as njscrypto from 'crypto';
import * as flow from 'lodash.flow';

// @TODO
// import { private_key, client_email } from '../GCS_CREDENTIALS.json'
const private_key = 'lol';
const client_email = 'rofl';

const BASE_URL = 'https://storage.googleapis.com';

interface SignedURLParams {
  bucket: string;
  path?: string[];
  object: string;
  action: 'GET' | 'PUT' | 'DELETE';
  expires: number;
  contentMd5?: string;
  contentType?: string;
}

/**
 *
 */
const makeResource = ({
    bucket,
    path = [],
    object,
}: SignedURLParams): string => {
  const location = `${path.join('/')}/${object}`;
  return `/${bucket}/${encodeURIComponent(location)}`;
};

/**
 *
 */
const makeSignatureBlob = (params: SignedURLParams): string => {
  const { action, contentMd5, contentType, expires } = params;
  return [
    action,
    contentMd5 || '',
    contentType || '',
    expires,
    makeResource(params),
  ].join('\n');
};

/**
 *
 */
const makeSignature = (blob: string): string =>
  encodeURIComponent(njscrypto
    .createSign('RSA-SHA256')
    .update(blob)
    .sign(private_key, 'base64'),
  );

/**
 *
 */
const makeUrl = (
  params: SignedURLParams,
  signature: string,
): string => [
  BASE_URL,
  makeResource(params),
  `?GoogleAccessId=${encodeURIComponent(client_email)}`,
  `&Expires=${params.expires}`,
  `&Signature=${signature}`,
].join('');

/**
 *
 */
export const getSignedUrl = (params: SignedURLParams) => flow([
  makeSignatureBlob,
  makeSignature,
  makeUrl.bind(null, params),
])(params);
