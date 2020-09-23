declare module 'ramda.juxt' {
  export default function <A extends any[], R1, R2>(fns: [(...a: A) => R1, (...a: A) => R2]): (...a: A) => [R1, R2];
  export default function<A extends any[], R1, R2, R3>(fns: [(...a: A) => R1, (...a: A) => R2, (...a: A) => R3]): (...a: A) => [R1, R2, R3];
  export default function<A extends any[], R1, R2, R3, R4>(fns: [(...a: A) => R1, (...a: A) => R2, (...a: A) => R3, (...a: A) => R4]): (...a: A) => [R1, R2, R3, R4];
  export default function<A extends any[], R1, R2, R3, R4, R5>(fns: [(...a: A) => R1, (...a: A) => R2, (...a: A) => R3, (...a: A) => R4, (...a: A) => R5]): (...a: A) => [R1, R2, R3, R4, R5];
  export default function<A extends any[], U>(fns: Array<(...args: A) => U>): (...args: A) => U[];
}

declare module 'ramda.identity' {
  export default function<T>(a: T): T;
}

declare module 'ramda.keys' {
  export default function<T extends object>(x: T): Array<keyof T>;
  export default function<T>(x: T): string[];
}

declare module 'ramda.pick' {
  export default function<T, K extends string | number | symbol>(names: readonly K[], obj: T): Pick<T, Exclude<keyof T, Exclude<keyof T, K>>>;
  export default function<K extends string | number | symbol>(names: readonly K[]): <T>(obj: T) => Pick<T, Exclude<keyof T, Exclude<keyof T, K>>>;
}

declare module 'ramda.usewith' {
  export default function (fn: ((...a: readonly any[]) => any), transformers: Array<((...a: readonly any[]) => any)>): (...a: readonly any[]) => any;
}
