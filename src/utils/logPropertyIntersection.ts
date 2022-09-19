import type { AnyObject } from '../types';
import { orange } from './cliColors';

export const logPropertyIntersection = (intersection: AnyObject): void => {
  console.warn(`🟠 ${orange('Intersection detected')}: ${JSON.stringify(intersection, null, 2)}`);
};
