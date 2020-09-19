import fetch from 'jest-fetch-mock';
import { sampleUserData } from '../example/utils/sample-data';
import { mergeProps } from '../src';
import {
  getServerSideBarProps,
  getServerSideFooProps,
  getServerSideUserProps
} from './utils';

// @ts-ignore
global.console = {
  warn: jest.fn(),
}

describe('merge props', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('should merge object properties', async () => {
    fetch.mockResponseOnce(
      JSON.stringify(sampleUserData)
    );
    const onSuccess = jest.fn()
    const getServerSideProps = mergeProps(
      getServerSideFooProps,
      getServerSideBarProps,
      getServerSideUserProps({
        onSuccess,
      }),
    );

    const response = await getServerSideProps({} as any);
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith(sampleUserData);
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          foo: 'foo',
          bar: 'bar',
          users: sampleUserData
        }
      })
    );
  });

  it('should warn of property intersections', async () => {
    fetch.mockResponseOnce(
      JSON.stringify(sampleUserData)
    );
    const onSuccess = jest.fn()
    const getServerSideProps = mergeProps(
      getServerSideFooProps,
      getServerSideFooProps,
      getServerSideUserProps({
        onSuccess,
      }),
    );

    const response = await getServerSideProps({} as any);
    const errorMsg = `Intersection detected in: ${JSON.stringify({ foo: 'foo' }, null, 2)}`;
    expect(global.console.warn).toHaveBeenCalledWith(errorMsg)
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          foo: 'foo',
          users: sampleUserData
        }
      })
    );
  });
});
