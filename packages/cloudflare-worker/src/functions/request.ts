
/**
 *
 */
export const isRequestForAsset = (
  path: string,
  exts: string[] = ['js', 'css'],
): boolean => new RegExp(`\.(${exts.join('|')})`)
  .test(path
    .split('/')
    .filter(Boolean)
    .pop(),
  );

interface ParsedPath {
  app: string;
  version: string;
  asset: string;
}

/**
 *
 */
export const parsePath = (url: string): ParsedPath => {
  const { pathname } = new URL(url);
  const parts = pathname.split('/').filter(Boolean);
  return {
    app: parts[0] || '',
    version: parts[1] || '',
    asset: parts[2] || '',
  };
};

interface ParsedParams {
  [key: string]: any;
}

/**
 *
 */
export const parseParams = (url: string): ParsedParams => {
  const { searchParams } = new URL(url);
  return Array.from(searchParams.entries()).reduce((obj, [k, v]) => {
    obj[k] = v;
    return obj;
  }, {});
};
