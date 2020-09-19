import { GetStaticPropsContext } from 'next';

export interface GetStaticFooProps {
  foo: 'foo';
}

interface GetStaticFooPropsOptions {
  onSuccess: (ctx: GetStaticPropsContext) => void;
}

export const getStaticFooProps = ({ onSuccess }: GetStaticFooPropsOptions) =>
  async (ctx: GetStaticPropsContext) => {
    onSuccess && onSuccess(ctx);
    return {
      props: {
        foo: 'foo',
      }
    };
  };
