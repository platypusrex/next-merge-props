import { User } from '../interfaces';

export interface GetServerSideUserProps {
  users: User[];
}

interface GetServerSideUserPropsOptions {
  onSuccess: (users: User[]) => void;
}

export const getServerSideUserProps = ({ onSuccess }: GetServerSideUserPropsOptions) =>
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
