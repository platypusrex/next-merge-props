import { orange } from './cliColors';
import type { AnyObject } from '../types';

export const logPropertyIntersection = (intersection: AnyObject): void => {
  console.warn(
    `🟠 ${orange('Intersection detected')}: ${JSON.stringify(
      intersection,
      null,
      2
    )}`
  );
};
