import { juxt } from 'ramda';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { intersectObject, logPropertyIntersection } from './utils';
import { PageProps } from './types';

export const mergeProps = <P = PageProps>(...args: any[]) => (
  ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<P>> => {
  return Promise.all<GetServerSidePropsResult<P>>(
    juxt<any[], GetServerSidePropsResult<P>>(args)(ctx)
  ).then(result =>
    result.reduce((acc, curr) => {
      const intersection = intersectObject(acc.props, curr.props);
      if (Object.keys(intersection).length) logPropertyIntersection(intersection);
      return {
        ...acc,
        props: { ...acc.props, ...curr.props },
      };
    }),
  );
};
