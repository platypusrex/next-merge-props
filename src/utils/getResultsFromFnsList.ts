import type {
  AnyObject,
  Context,
  MergePropsOptions,
  MergePropsOptionsSequential,
  PropsResult,
} from '../types';
import { orange } from './cliColors';
import { shouldShortCircuit } from './shouldShortCircuit';
import { isProd } from './isProd';

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
    if ((options as AnyObject)?.shortCircuit && !isProd()) {
      console.warn(`🟠 ${orange('Short circuit is not supported for parallel resolution')}`);
    }
    results = await Promise.all(fns.map((fn) => fn(ctx)));
  }

  return results;
};
