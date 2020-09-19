# next-merge-props

### Motivation
Prior to [Next.js](https://nextjs.org) introducing `getServerSideProps` and `getStaticProps`,
wrapping page components using HOC's was a popular pattern that allowed you to easily grab things
from SSR like cookies or session data using `getInitialProps` and reuse in any page. The goal of the lib 
is simply to aid in recreating a similar pattern, allowing you to compose any number of specialized data fetching
functions and merge the results of each.  

### Installation
npm
```shell script
npm install --save merge-next-props
```

or yarn
```shell script
yarn add merge-next-props
```

### Usage
#### Using `getServerSideProps`
```typescript
// getServerSideFooProps.ts

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
```
```typescript
// getServerSideUserProps.ts

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
```
```typescript
// pages/index.tsx

import { NextPage } from 'next';
import { mergeProps } from 'next-merge-props';
import { getServerSideFooProps, GetServerSideFooProps } from '../lib/getServerSideFooProps';
import { getServerSideUserProps, GetServerSideUserProps } from '../lib/getServerSideUserProps';

type IndexPageProps =
  GetServerSideFooProps &
  GetServerSideUserProps;

const IndexPage: NextPage<IndexPageProps> = (props) => (
  <div>
    <pre>{JSON.stringify(props, null, 2) }</pre>
  </div>
);

export const getServerSideProps = mergeProps<IndexPageProps>(
  getServerSideFooProps({
    onSuccess: (ctx) => {
      // ...do something with context here
    }
  }),
  getServerSideUserProps({
    onSuccess: (users) => {
      // ...do something with the result here
    }
  })
);

export default IndexPage;
```
#### Using `getStaticProps`
```typescript
// getStaticFooProps.ts

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
      },
    };
  };
```
```typescript
// getStaticUserProps.ts

import { User } from '../interfaces';

export interface GetServerSideUserProps {
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
```
```typescript
// pages/index.tsx

import { NextPage } from 'next';
import { mergeProps } from 'next-merge-props';
import { getStaticFooProps, GetStaticFooProps } from '../lib/getStaticFooProps';
import { getStaticUserProps, GetStaticUserProps } from '../lib/getStaticUserProps';

type IndexPageProps =
  GetStaticFooProps &
  GetStaticUserProps;

const IndexPage: NextPage<IndexPageProps> = (props) => (
  <div>
    <pre>{JSON.stringify(props, null, 2) }</pre>
  </div>
);

export const getStaticProps = mergeProps<IndexPageProps>(
  getStaticFooProps({
    onSuccess: (ctx) => {
      // ...do something with context here
    }
  }),
  getStaticUserProps({
    onSuccess: (users) => {
      // ...do something with the result here
    }
  })
);

export default IndexPage;
```
The resulting prop object from both of the above would be
```typescript
{
  foo: 'foo',
  users: [
    { id: 101, name: 'Alice' },
    { id: 102, name: 'Bob' },
    { id: 103, name: 'Caroline' },
    { id: 104, name: 'Dave' },
  ]
}
```
