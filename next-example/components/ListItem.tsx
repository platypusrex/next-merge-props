import React from 'react';
import Link from 'next/link';
import { User } from '../interfaces';

interface ListItemProps {
  data: User;
}

const ListItem: React.FC<ListItemProps> = ({ data }) => (
  <Link href="/users/[id]" as={`/users/${data.id}`}>
    <a>
      {data.id}: {data.name}
    </a>
  </Link>
);

export default ListItem;
