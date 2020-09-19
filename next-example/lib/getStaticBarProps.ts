import { GetStaticPropsContext } from 'next';

export interface GetStaticBarProps {
  bar: 'bar';
}

interface GetStaticBarPropsOptions {
  onSuccess: (ctx: GetStaticPropsContext) => void;
}

export const getStaticBarProps = ({ onSuccess }: GetStaticBarPropsOptions) =>
  async (ctx: GetStaticPropsContext) => {
    onSuccess && onSuccess(ctx);
    return {
      props: {
        bar: 'bar',
      }
    };
  };
