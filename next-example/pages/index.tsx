import React from 'react';
import Layout from '../components/Layout';
import { NextPage } from 'next';
import { mergeProps } from 'next-merge-props';
import { getServerSideFooProps, GetServerSideFooProps } from '../lib/getServerSideFooProps';
import { getServerSideBarProps, GetServerSideBarProps } from '../lib/getServerSideBarProps';
import { getServerSideUserProps, GetServerSideUserProps } from '../lib/getServerSideUserProps';

type IndexPageProps =
  GetServerSideFooProps &
  GetServerSideBarProps &
  GetServerSideUserProps;

const IndexPage: NextPage<IndexPageProps> = (props: IndexPageProps) => (
  <Layout title="Home | next-merge-props example">
    <h1>merge server-side props 👋</h1>
    <div>
      <pre>{JSON.stringify(props, null, 2) }</pre>
    </div>
  </Layout>
);

export const getServerSideProps = mergeProps<IndexPageProps>(
  getServerSideFooProps({
    onSuccess: (ctx) => {
      console.log('foo props success', ctx);
    }
  }),
  getServerSideBarProps({
    onSuccess: (ctx) => {
      console.log('bar props success', ctx);
    }
  }),
  getServerSideUserProps({
    onSuccess: (users) => {
      console.log('users on success', users);
    }
  })
);

export default IndexPage;
