import { AnyObject, PropsResult } from '../types';
import { shallowEqual } from './shallowEqual';
import { logPropertyIntersection } from './logPropertyIntersection';

export const mergeResults = <P = AnyObject>(
  results: PropsResult<P>[],
  debug = false
): PropsResult<P> =>
  results.reduce<PropsResult<P>>((acc, curr) => {
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
