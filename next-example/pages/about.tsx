import Link from 'next/link';
import Layout from '../components/Layout';
import { mergeProps } from 'next-merge-props';
import { getStaticFooProps, GetStaticFooProps } from '../lib/getStaticFooProps';
import { getStaticBarProps, GetStaticBarProps } from '../lib/getStaticBarProps';
import { GetStaticUserProps, getStaticUserProps } from '../lib/getStaticUserProps';
import { NextPage } from 'next';

type AboutPageProps =
  GetStaticFooProps &
  GetStaticBarProps &
  GetStaticUserProps;

const AboutPage: NextPage<AboutPageProps> = (props) => (
  <Layout title="Home | next-merge-props example">
    <h1>merge static props 👋</h1>
    <div>
      <pre>{JSON.stringify(props, null, 2) }</pre>
    </div>
    <p>
      <Link href="/">
        <a>Go home</a>
      </Link>
    </p>
  </Layout>
);

export const getStaticProps = mergeProps(
  getStaticFooProps({
    onSuccess: (ctx) => {
      console.log('static foo props ctx', ctx);
    }
  }),
  getStaticBarProps({
    onSuccess: (ctx) => {
      console.log('static bar props ctx', ctx);
    }
  }),
  getStaticUserProps({
    onSuccess: (users) => {
      console.log('users success', users);
    }
  })
)

export default AboutPage;
