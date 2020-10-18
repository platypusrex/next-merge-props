import { AnyObject, Context, PropsResult, ResolutionType } from '../types';

export const getResultsFromFnsList = async <P = AnyObject>(
  ctx: Context,
  resolutionType: ResolutionType,
  fns: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
): Promise<PropsResult<P>[]> => {
  let results: PropsResult<P>[] = [];

  if (resolutionType === 'sequential') {
    for (const fn of fns) {
      results.push(await fn(ctx));
    }
  } else {
    results = await Promise.all(fns.map(fn => fn(ctx)));
  }

  return results;
};
