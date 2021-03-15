import { AnyObject, PropsResult } from '../types';
import { shallowEqual } from './shallowEqual';
import { logPropertyIntersection } from './logPropertyIntersection';
import { Redirect } from 'next';

interface NextRedirectResult {
  redirect?: Redirect;
  revalidate?: number | boolean;
  notFound?: true;
}

interface NextResultWithProps<P> {
  props: P;
  revalidate?: number | boolean;
}

export const mergeResults = <P = AnyObject>(
  results: PropsResult<P>[],
  debug = false
): PropsResult<P> => {
  const result = results.find(
    result => (result as NextRedirectResult).redirect
  ) as NextRedirectResult;
  if (result?.redirect) {
    return {
      redirect: result.redirect,
      ...(result.revalidate !== undefined
        ? { revalidate: result.revalidate }
        : {}),
    };
  }

  if (result?.notFound) {
    return { notFound: result.notFound };
  }

  return (results as NextResultWithProps<P>[]).reduce((acc, curr) => {
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
      ...(curr.revalidate ? { revalidate: curr.revalidate } : {}),
    };
  }, {} as NextResultWithProps<P>);
};
