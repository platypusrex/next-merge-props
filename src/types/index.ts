import type {
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
export type ShortCircuitType =
  | 'redirect-and-notfound'
  | 'redirect-only'
  | 'notfound-only'
  | 'never';

export type Context = GetServerSidePropsContext | GetStaticPropsContext;
export type PropsResult<P = AnyObject> = GetServerSidePropsResult<P> | GetStaticPropsResult<P>;
export type NextDataFunction = GetServerSideProps | GetStaticProps;

export type MergePropsOptionsSequential = {
  resolutionType?: Extract<ResolutionType, 'sequential'>;
  shortCircuit?: ShortCircuitType;
  debug?: boolean;
};

export type MergePropsOptionsParallel = {
  resolutionType?: Extract<ResolutionType, 'parallel'>;
  debug?: boolean;
};

export type MergePropsOptions = MergePropsOptionsSequential | MergePropsOptionsParallel;
