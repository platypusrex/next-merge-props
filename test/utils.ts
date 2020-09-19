import { User } from '../example/interfaces';

export const getServerSideFooProps = async () => {
  return {
    props: {
      foo: 'foo',
    }
  };
};

export const getServerSideBarProps = async () => {
  return {
    props: {
      bar: 'bar',
    }
  };
};

export const getServerSideUserProps = ({ onSuccess }: { onSuccess: (users: User[]) => void }) =>
  async () => {
    const res = await fetch(`http://localhost:3000/api/users`);
    const users = await res.json();

    if (users && onSuccess) {
      onSuccess(users)
    }

    return {
      props: {
        users,
      }
    };
  };

