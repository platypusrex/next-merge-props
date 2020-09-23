import identity from 'ramda.identity';
import keys from 'ramda.keys';
import pick from 'ramda.pick';
import usewith from 'ramda.usewith';

export const intersectObject = usewith(pick, [keys, identity]);

export const logPropertyIntersection = (intersection: Record<string, any>) => {
  console.warn(
    `Intersection detected in: ${JSON.stringify(intersection, null, 2)}`
  );
};
