import * as React from 'react';
import ListItem from './ListItem';
import { User } from '../interfaces';

interface ListProps {
  items: User[];
}

const List: React.FC<ListProps> = ({ items }) => (
  <ul>
    {items.map((item) => (
      <li key={item.id}>
        <ListItem data={item} />
      </li>
    ))}
  </ul>
);

export default List;
