import { GetServerSidePropsContext } from 'next';

export interface GetServerSideBarProps {
  bar: 'bar';
}

interface GetServerSideBarPropsOptions {
  onSuccess: (ctx: GetServerSidePropsContext) => void;
}

export const getServerSideBarProps = ({ onSuccess }: GetServerSideBarPropsOptions) =>
  async (ctx: GetServerSidePropsContext) => {
    onSuccess && onSuccess(ctx);
    return {
      props: {
        bar: 'bar',
      }
    };
  };
