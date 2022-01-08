import { PropsResult } from '../src/types';

interface User {
  id: number;
  name: string;
}

interface GetServerSideUserProps {
  users: User[];
}

interface GetServerSideFooProps {
  foo: 'foo';
}

interface GetServerSideBarProps {
  bar: 'bar';
}

export const getServerSideFooProps = async (): Promise<PropsResult<
  GetServerSideFooProps
>> => {
  return {
    props: {
      foo: 'foo',
    },
  };
};

export const getServerSideBarProps = async (): Promise<PropsResult<
  GetServerSideBarProps
>> => {
  return {
    props: {
      bar: 'bar',
    },
  };
};

export const getStaticFooProps = async (): Promise<PropsResult<
  GetServerSideFooProps
>> => {
  return {
    props: {
      foo: 'foo',
    },
    revalidate: 60,
  };
};

export const getStaticBarProps = async (): Promise<PropsResult<
  GetServerSideBarProps
>> => {
  return {
    props: {
      bar: 'bar',
    },
  };
};

export const getServerSideRedirectProps = async (): Promise<PropsResult> => {
  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };
};

export const getServerSideNotFoundProps = async (): Promise<PropsResult> => {
  return {
    notFound: true,
  };
};

export const getServerSideUserProps = ({
  onSuccess,
}: {
  onSuccess: (users: User[]) => void;
}) => async (): Promise<PropsResult<GetServerSideUserProps>> => {
  const res = await fetch(`http://localhost:3000/api/users`);
  const users = await res.json();

  if (users && onSuccess) {
    onSuccess(users);
  }

  return {
    props: {
      users,
    },
  };
};
