import { getResultsFromFnsList, mergeResults } from './utils';
import type {
  AnyObject,
  Context,
  MergePropsOptions,
  NextDataFunction,
  PropsResult,
} from './types';

type MergeProps<P> = (ctx: Context) => Promise<PropsResult<P>>;

const defaultOptions: Required<MergePropsOptions> = {
  resolutionType: 'sequential',
  shortCircuit: 'redirect-and-notfound',
  debug: false,
};

export function mergeProps<P>(...fns: NextDataFunction[]): MergeProps<P>;
export function mergeProps<P>(
  fns: NextDataFunction[],
  options?: MergePropsOptions
): MergeProps<P>;
export function mergeProps<P = AnyObject>(
  ...fns: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
): MergeProps<P> {
  const isFirstArgArray = Array.isArray(fns[0]);
  const fnsList = isFirstArgArray ? fns[0] : fns;
  const options: Required<MergePropsOptions> = isFirstArgArray
    ? {
        ...defaultOptions,
        ...fns[1],
      }
    : defaultOptions;

  return async (ctx: Context): Promise<PropsResult<P>> => {
    const results: PropsResult<P>[] = await getResultsFromFnsList(
      ctx,
      fnsList,
      options
    );

    return mergeResults(results, options.debug);
  };
}
