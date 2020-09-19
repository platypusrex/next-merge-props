import { GetServerSidePropsContext } from 'next';

export interface GetServerSideFooProps {
  foo: 'foo';
}

interface GetServerSideFooPropsOptions {
  onSuccess: (ctx: GetServerSidePropsContext) => void;
}

export const getServerSideFooProps = ({ onSuccess }: GetServerSideFooPropsOptions) =>
  async (ctx: GetServerSidePropsContext) => {
    onSuccess && onSuccess(ctx);
    return {
      props: {
        foo: 'foo',
      }
    };
  };
