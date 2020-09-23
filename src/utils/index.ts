import { identity, keys, pick, useWith as usewith } from 'ramda';

export const intersectObject = usewith(pick, [keys, identity]);

export const logPropertyIntersection = (intersection: Record<string, any>) => {
  console.warn(
    `Intersection detected in: ${JSON.stringify(intersection, null, 2)}`
  );
};
