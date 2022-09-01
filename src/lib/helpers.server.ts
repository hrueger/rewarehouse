export function fixDates<T extends any[]>(o: T): T {
    const obj = o as any;
    // traverse the object or array recursively and fix dates
    if (obj instanceof Date) {
        return obj.toISOString() as any;
    } else if (obj instanceof Array) {
        return obj.map((o) => fixDates(o)) as any;
    } else if (obj instanceof Object) {
        return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, fixDates(v as any)])) as any;
    } else {
        return obj;
    }
}

type ArrayElement<ArrayType extends readonly unknown[]> = 
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

type Extension = {
    _pendingDelete?: boolean;
    _pendingSave?: boolean;
    _pendingCustom?: string;
};
    
export type Extended<T> = T & Extension;
export type ExtendedArray<T extends Record<string, unknown>[]> = (ArrayElement<T> & Extension)[];