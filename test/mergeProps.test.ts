import fetch from 'jest-fetch-mock';
import { sampleUserData } from '../next-example/utils/sample-data';
import { mergeProps } from '../src';
import {
  getServerSideBarProps,
  getServerSideFooProps,
  getServerSideNotFoundProps,
  getServerSideRedirectProps,
  getServerSideUserProps,
  getStaticBarProps,
  getStaticFooProps,
} from './utils';
import { orange } from '../src/utils';

// @ts-ignore
global.console = {
  warn: jest.fn(),
};

describe('merge props', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('should merge object properties from random number of function args', async () => {
    fetch.mockResponseOnce(JSON.stringify(sampleUserData));
    const onSuccess = jest.fn();
    const getServerSideProps = mergeProps(
      getServerSideFooProps,
      getServerSideBarProps,
      getServerSideUserProps({
        onSuccess,
      })
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await getServerSideProps({} as any);
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith(sampleUserData);
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          foo: 'foo',
          bar: 'bar',
          users: sampleUserData,
        },
      })
    );
  });

  it('should merge object properties if first arg is an array of functions', async () => {
    fetch.mockResponseOnce(JSON.stringify(sampleUserData));
    const onSuccess = jest.fn();
    const getServerSideProps = mergeProps([
      getServerSideFooProps,
      getServerSideBarProps,
      getServerSideUserProps({
        onSuccess,
      }),
    ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await getServerSideProps({} as any);
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith(sampleUserData);
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          foo: 'foo',
          bar: 'bar',
          users: sampleUserData,
        },
      })
    );
  });

  it('should merge object properties if resolution type is parallel', async () => {
    fetch.mockResponseOnce(JSON.stringify(sampleUserData));
    const onSuccess = jest.fn();
    const getServerSideProps = mergeProps(
      [
        getServerSideFooProps,
        getServerSideBarProps,
        getServerSideUserProps({
          onSuccess,
        }),
      ],
      {
        resolutionType: 'parallel',
      }
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await getServerSideProps({} as any);
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith(sampleUserData);
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          foo: 'foo',
          bar: 'bar',
          users: sampleUserData,
        },
      })
    );
  });

  it('should merge static object properties and return a revalidate property if provided by any static function', async () => {
    fetch.mockResponseOnce(JSON.stringify(sampleUserData));
    const getStaticProps = mergeProps(getStaticFooProps, getStaticBarProps);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await getStaticProps({} as any);
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          foo: 'foo',
          bar: 'bar',
        },
        revalidate: 60,
      })
    );
  });

  it('should return redirect if any resulting server side/static function returns one', async () => {
    const getServerSideProps = mergeProps(
      getServerSideFooProps,
      getServerSideBarProps,
      getServerSideRedirectProps
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await getServerSideProps({} as any);
    expect(response).toEqual(
      expect.objectContaining({
        redirect: {
          destination: '/',
          permanent: false,
        },
      })
    );
  });

  it('should return notFound if any resulting server side/static function returns one', async () => {
    const getServerSideProps = mergeProps(
      getServerSideFooProps,
      getServerSideBarProps,
      getServerSideNotFoundProps,
      getServerSideRedirectProps
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await getServerSideProps({} as any);
    expect(response).toEqual(
      expect.objectContaining({
        notFound: true,
      })
    );
  });

  it('should not warn of property intersections by default', async () => {
    fetch.mockResponseOnce(JSON.stringify(sampleUserData));
    const onSuccess = jest.fn();
    const getServerSideProps = mergeProps(
      getServerSideFooProps,
      getServerSideFooProps,
      getServerSideUserProps({
        onSuccess,
      })
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await getServerSideProps({} as any);
    expect(global.console.warn).not.toHaveBeenCalled();
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          foo: 'foo',
          users: sampleUserData,
        },
      })
    );
  });

  it('should warn of property intersections', async () => {
    fetch.mockResponseOnce(JSON.stringify(sampleUserData));
    const onSuccess = jest.fn();
    const getServerSideProps = mergeProps(
      [
        getServerSideFooProps,
        getServerSideFooProps,
        getServerSideUserProps({
          onSuccess,
        }),
      ],
      {
        debug: true,
      }
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await getServerSideProps({} as any);
    const errorMsg = `🟠 ${orange('Intersection detected')}: ${JSON.stringify(
      { foo: 'foo' },
      null,
      2
    )}`;
    expect(global.console.warn).toHaveBeenCalledWith(errorMsg);
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          foo: 'foo',
          users: sampleUserData,
        },
      })
    );
  });
});
