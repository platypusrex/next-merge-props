import { identity, keys, pick, useWith } from 'ramda';

export const intersectObject = useWith(pick, [keys, identity]);

export const logPropertyIntersection = (intersection: Record<string, any>) => {
  console.warn(
    `Intersection detected in: ${JSON.stringify(intersection, null, 2)}`
  );
}
