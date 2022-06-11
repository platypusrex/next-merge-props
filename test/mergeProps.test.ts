import fetch from 'jest-fetch-mock';
import { orange } from '../src/utils';
import { mergeProps } from '../src';
import { AnyObject } from '../src/types';
import {
  getServerSideBarProps,
  getServerSideFooProps,
  getServerSideNotFoundProps,
  getServerSideRedirectProps,
  getServerSideUserProps,
  getStaticBarProps,
  getStaticFooProps,
  sampleUserData,
} from './utils';

describe('merge props', () => {
  beforeEach(() => {
    (global as AnyObject).console = { warn: jest.fn() };
    fetch.resetMocks();
  });

  afterEach(() => {
    (global as AnyObject).console = {}
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

  it('should merge static object properties and return a revalidate property if provided', async () => {
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

  it('should short circuit if redirect is returned', async () => {
    const getServerSideTestProps = jest.fn(() => ({ props: {} }));

    const getServerSideProps = mergeProps(
      getServerSideRedirectProps,
      getServerSideTestProps
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await getServerSideProps({} as any);
    expect(getServerSideTestProps).not.toHaveBeenCalled();
    expect(response).toEqual(
      expect.objectContaining({
        redirect: {
          destination: '/',
          permanent: false,
        },
      })
    );
  });

  it('should short circuit if notFound is returned', async () => {
    const getServerSideTestProps = jest.fn(() => ({ props: {} }));

    const getServerSideProps = mergeProps(
      getServerSideNotFoundProps,
      getServerSideTestProps
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await getServerSideProps({} as any);
    expect(getServerSideTestProps).not.toHaveBeenCalled();
    expect(response).toEqual(
      expect.objectContaining({
        notFound: true,
      })
    );
  });

  it('should respect the order of functions when short circuiting composed functions', async () => {
    const getServerSidePropsOne = jest.fn(() => ({ props: {} }));
    const getServerSidePropsTwo = jest.fn(() => ({ props: {} }));

    const getServerSideProps = mergeProps(
      getServerSidePropsOne,
      getServerSideNotFoundProps,
      getServerSideRedirectProps,
      getServerSidePropsTwo
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await getServerSideProps({} as any);
    expect(getServerSidePropsOne).toHaveBeenCalled();
    expect(getServerSidePropsTwo).not.toHaveBeenCalled();
    expect(response).toEqual(
      expect.objectContaining({
        notFound: true,
      })
    );
  });

  it('should not short circuit if resolutionType is parallel', async () => {
    const getServerSidePropsOne = jest.fn(() => ({ props: {} }));
    const getServerSidePropsTwo = jest.fn(() => ({ props: {} }));

    const getServerSideProps = mergeProps(
      [
        getServerSidePropsOne,
        getServerSideNotFoundProps,
        getServerSidePropsTwo,
      ],
      {
        resolutionType: 'parallel',
      }
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await getServerSideProps({} as any);
    expect(global.console.warn).toHaveBeenCalledWith(`🟠 ${orange('Short circuit is not supported for parallel resolution')}`);
    expect(getServerSidePropsOne).toHaveBeenCalled();
    expect(getServerSidePropsTwo).toHaveBeenCalled();
    expect(response).toEqual(
      expect.objectContaining({
        notFound: true,
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
