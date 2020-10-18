import {
  AnyObject,
  Context,
  NextDataFunction,
  PropsResult,
  ResolutionType,
} from './types';
import {
  getResultsFromFnsList,
  logPropertyIntersection,
  shallowEqual,
} from './utils';

interface MergePropsOptions {
  resolutionType?: ResolutionType;
  debug?: boolean;
}

const defaultOptions: Required<MergePropsOptions> = {
  resolutionType: 'sequential',
  debug: false,
};

type MergeProps = [MergePropsOptions | NextDataFunction, ...NextDataFunction[]];

export const mergeProps = <P = AnyObject>(...args: MergeProps) => async (
  ctx: Context
): Promise<PropsResult<P>> => {
  const { resolutionType, debug } =
    typeof args[0] === 'object'
      ? {
          ...defaultOptions,
          ...args[0],
        }
      : defaultOptions;
  const fnsList = typeof args[0] === 'object' ? args.slice(1) : args;
  const results: PropsResult<P>[] = await getResultsFromFnsList(
    ctx,
    resolutionType,
    fnsList
  );

  return results.reduce<PropsResult<P>>((acc, curr) => {
    if (debug && process.env.NODE_ENV !== 'production') {
      const intersection = shallowEqual(acc.props, curr.props);
      if (intersection) logPropertyIntersection(intersection);
    }

    return {
      ...acc,
      props: {
        ...acc.props,
        ...curr.props,
      },
    };
  }, {} as PropsResult<P>);
};
