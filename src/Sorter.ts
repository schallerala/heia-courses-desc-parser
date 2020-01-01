type CompareFunction<O> = (o1: O, o2: O) => number;
type CompareKeyFunction<V> = (v1: V, v2: V) => number;

export function compareNumber (n1: number, n2: number): number {
    return n1 - n2;
}

export function compareString (n1: string, n2: string): number {
    return n1.localeCompare(n2);
}

interface KeyCompare<O> {
    key: keyof O;
    compare: CompareKeyFunction<O[keyof O]>
}

export function sortBy<O>(keys: Array<keyof O>): CompareFunction<O> {
    return function (o1: O, o2: O): number {
        for (const key of keys) {
            const v1 = o1[key];
            const v2 = o2[key];

            const result =
                (typeof v1 == 'number' && typeof v2 == "number") ? compareNumber(v1, v2) :
                (typeof v1 == 'string' && typeof v2 == "string") ? compareString(v1, v2) :
                NaN;

            if (result != 0)
                return result;
        }

        return 0;
    }
}