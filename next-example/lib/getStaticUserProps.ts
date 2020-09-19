import { User } from '../interfaces';

export interface GetStaticUserProps {
  users: User[];
}

interface GetStaticUserPropsOptions {
  onSuccess: (users: User[]) => void;
}

export const getStaticUserProps = ({ onSuccess }: GetStaticUserPropsOptions) =>
  async () => {
    const res = await fetch(`http://localhost:3000/api/users`);
    const users = await res.json();

    if (users && onSuccess) {
      onSuccess(users)
    }

    return {
      props: {
        users,
      },
      revalidate: 1
    };
  };
