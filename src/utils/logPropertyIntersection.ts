import { orange } from './cliColors';
import { AnyObject } from '../types';

export const logPropertyIntersection = (intersection: AnyObject): void => {
  console.warn(
    `🟠 ${orange('Intersection detected')}: ${JSON.stringify(
      intersection,
      null,
      2
    )}`
  );
};
