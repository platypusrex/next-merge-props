import { AnyObject } from '../types';

export const shallowEqual = (
  object1: AnyObject = {},
  object2: AnyObject = {}
): AnyObject | undefined => {
  if (!object1 || !object2) return;
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (!keys1.length || !keys2.length) return;

  for (const key of keys1) {
    if (object1[key] === object2[key]) {
      return object2;
    }
  }

  return;
};
