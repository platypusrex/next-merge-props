import type { PropsResult, ShortCircuitType } from '../types';

export const shouldShortCircuit = (
  result: PropsResult,
  shortCircuit?: ShortCircuitType
) => {
  if (!shortCircuit || shortCircuit === 'never') {
    return false;
  }

  const hasRedirect: boolean = 'redirect' in result && !!result?.redirect;
  const hasNotFound: boolean = 'notFound' in result && !!result?.notFound;

  switch (shortCircuit) {
    case 'redirect-and-notfound':
      return hasRedirect || hasNotFound;
    case 'redirect-only':
      return hasRedirect;
    case 'notfound-only':
      return hasNotFound;
  }
};
