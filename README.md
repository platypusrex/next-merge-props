# next-merge-props

[![npm Package](https://img.shields.io/npm/v/next-merge-props.svg)](https://www.npmjs.org/package/next-merge-props)
[![License](https://img.shields.io/npm/l/express.svg)](https://github.com/platypusrex/next-merge-props/blob/master/LICENSE)
[![Coverage Status](https://coveralls.io/repos/github/platypusrex/next-merge-props/badge.svg?branch=chore/coveralls-github-action)](https://coveralls.io/github/platypusrex/next-merge-props?branch=chore/coveralls-github-action)
![CI](https://github.com/platypusrex/next-merge-props/workflows/CI/badge.svg)

### Overview
Prior to [Next.js](https://nextjs.org) introducing `getServerSideProps` and `getStaticProps`,
wrapping page components using HOC's was a popular pattern that allowed you to easily grab things
from SSR like cookies or session data using `getInitialProps` and reuse in any page. The goal of the lib 
is simply to aid in recreating a similar pattern, allowing you to compose any number of specialized data fetching
functions and merge the results of each.  

### Installation
npm
```shell script
npm install --save next-merge-props
```

or yarn
```shell script
yarn add next-merge-props
```

### Usage

##### `mergeProps(...fns) | mergeProps([fns], options)`
Parameters can be expressed in 2 ways.
- `...fns: ...(GetServerSideProps | GetStaticProps)[]`

or
- `fns: (GetServerSideProps | GetStaticProps)[]`
- `options?: { resolutionType: 'parallel' | 'sequential', debug: boolean }`
    - default options: `{ resolutionType: 'sequential', debug: false }`
    
#### options
`resolutionType` <br/>
The `resolutionType` option allows you to specify how `mergeProps` resolves the promise
returned from each data function. The default is `sequential` and will resolve each promise
in order (left to right). If set to `parallel`, the results of each function are wrapped in
`Promise.all` and resolved in parallel. 

`debug` <br/>
The `debug` option will log any intersections that occur during the merge. The default is 
`false` and it will be disabled in production.    
```typescript  
import { mergeProps} from 'next-merge-props';

const getServerSideProps = mergeProps(
  getServerSideFooProps,
  getServerSideBarProps,
);

// or with options parameter
const getServerSideProps = mergeProps([
  getServerSideFooProps,
  getServerSideBarProps,
], {
  resolutionType: 'parallel',
  debug: true,
});
```

#### Example
##### __note:__ example below utilizes `getServerSideProps` but can be swapped with `getStaticProps` 
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

Usage without `options`:
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

Usage with `options`:
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

export const getServerSideProps = mergeProps<IndexPageProps>([
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
], {
  resolutionType: 'parallel',
  debug: true,
});

export default IndexPage;
```

The resulting `prop` object:
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
### Contributors
This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## LICENSE
MIT
