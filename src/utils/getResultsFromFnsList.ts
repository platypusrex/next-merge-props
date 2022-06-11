import type {
  AnyObject,
  Context,
  MergePropsOptions,
  MergePropsOptionsSequential,
  PropsResult,
  ShortCircuitType,
} from '../types';

const shouldShortCircuit = (
  result: PropsResult,
  shortCircuit?: ShortCircuitType
) => {
  if (!shortCircuit || shortCircuit === 'never') {
    return false;
  }

  const hasRedirect: boolean = 'redirect' in result && !!result?.redirect;
  const hasNotFound: boolean = 'notFound' in result && !!result?.notFound;

  switch (shortCircuit) {
    case 'redirect-and-notfound':
      return hasRedirect || hasNotFound;
    case 'redirect-only':
      return hasRedirect;
    case 'notfound-only':
      return hasNotFound;
  }
};

export const getResultsFromFnsList = async <P = AnyObject>(
  ctx: Context,
  fns: any[], // eslint-disable-line @typescript-eslint/no-explicit-any
  options: MergePropsOptions
): Promise<PropsResult<P>[]> => {
  const { resolutionType } = options;
  let results: PropsResult<P>[] = [];

  if (resolutionType === 'sequential') {
    const { shortCircuit } = options as MergePropsOptionsSequential;
    for (const fn of fns) {
      const result = await fn(ctx);
      results.push(result);

      if (shouldShortCircuit(result, shortCircuit)) break;
    }
  } else {
    results = await Promise.all(fns.map((fn) => fn(ctx)));
  }

  return results;
};
