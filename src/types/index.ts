import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyObject = Record<string, any>;
export type ResolutionType = 'parallel' | 'sequential';
export type Context = GetServerSidePropsContext | GetStaticPropsContext;
export type PropsResult<P> =
  | GetServerSidePropsResult<P>
  | GetStaticPropsResult<P>;
export type NextDataFunction = GetServerSideProps | GetStaticProps;
