/**
 * Returns all the paths of a given object type as a union of string literals.
 */
type Paths<T extends Record<string, unknown>, Prefix extends string = ''> = {
  [K in keyof T]: T[K] extends Record<string, unknown>
    ?
        | `${Prefix & string}${Prefix extends '' ? '' : '.'}${K & string}`
        | Paths<T[K], `${Prefix & string}${Prefix extends '' ? '' : '.'}${K & string}`>
    : `${Prefix & string}${Prefix extends '' ? '' : '.'}${K & string}`;
}[keyof T];

/**
 * Returns the type of a given path in a given object type.
 */
type PathMatcher<T, Path extends string> = Path extends `${infer Head}.${infer Tail}`
  ? Head extends keyof T
    ? PathMatcher<T[Head], Tail>
    : never
  : Path extends keyof T
  ? T[Path]
  : never;
