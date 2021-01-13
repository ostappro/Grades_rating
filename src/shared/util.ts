/**
 * Remove all of the entries set to undefined
 * @param obj Object to be pruned. NOTE it must be an object
 * @returns Object without properties that were undefined
 * 
 */
export function prune(obj: any) {
    return Object.fromEntries(Object.entries(obj)
        .filter(([_, value]) => typeof value !== "undefined"))
}

export type Type = String | Number | Boolean | Array<any> | Object | null | undefined | number | string | boolean
export interface Schema {
    [key: string]: Type
}
/**
 * A pretty crude implementation of shape cheking. 
 * Checks if object is in specified shape
 * Schema is used for shallow shape validation only
 * 
 * Schema supports following type parameters:
 * - String    : for any string
 * - Number    : for any number
 * - Boolean   : for any boolean
 * - Array     : for any array
 * - Object    : for any object
 * - null      : for a null 
 * - undefined : for undefined
 * - <number>  : for specific number value
 * - <string>  : for specific string value
 * - <boolean> : for specific boolean value
 * 
 * This is in no way a type system. Just a simpler, more declarative way of checking object entries
 * NOTE: Can't check for optionals. Maybe should be added later
 * NOTE: Can't perform deep check. Only shallow checks are permitted for now
 * @param obj Object to be tested
 * @param schema Schema to test object against
 * @returns boolean to indicate if object is in shape of scema
 * 
 */
export function inShapeOf(obj: any, schema: Schema): boolean {
    for (let pair of Object.entries(schema)) {
        const [key, type] = pair
        if (type === null && obj[key] !== null) return false
        switch (typeof type) {
            case "undefined":
            case "number":
            case "string":
            case "boolean":
                if (obj[key] !== type) return false
                break;
            case "function":
                const schemaVal = new (type as any)().valueOf()
                if (typeof schemaVal !== typeof obj[key]) return false
        }
    }
    return true
}

/**
 * Converts user input into natural number
 * @param str String number from input field
 * @returns number interpreted from string
 * 
 * @todo //TODO: Write tests
 */
export function toCountNumber(str: string) {
    let num = 0
    for (let i=0; i<str.length; ++i) {
        let char = str.charAt(i)
        let digit = Number.parseInt(char)
        if (!Number.isNaN(digit))
        num = num*10 + digit
    }
    return num
}

/**
 * Creates a function that no matter how often called, gets called only after n miliseconds of not being invoked
 * @param func function to be debounced
 * @param wait timeout to wait until next function invocation
 * @param immediate whether function should trigger on leaning edge instead of trailing
 * @returns debounced function
 */
export function debounce<F extends (...args: any[]) => void>(func: F, wait: number) {
	let timeout: null | number | NodeJS.Timeout;
	return (...args: Parameters<F>) => {
		var later = () => {
            timeout = null;
            func(...args)
		};
		clearTimeout(timeout as any);
		timeout = setTimeout(later, wait);
	};
};

/**
 * Compares whether or not arrays contain the same elements (uses === for equality)
 * @param arr1 first array to compare
 * @param arr2 second array to compare
 * @returns true if arrays contain same elements. false otherwise
 */
export function arrCmp(arr1: any[], arr2: any[]) {
    if (arr1 === arr2) return true
    if (arr1.length !== arr2.length) return false
    for (let i = 0; i < arr2.length; ++i) {
        if (arr1[i] !== arr2[i]) return false
    }
    return true
}

/**
 * Creates a function that is called only when arguments change. 
 * NOTE: prefer using pure functions (with determenistic results) 
 *       cause if arguments match previous call, same result will be returned.
 *       (and function won't be invoked)
 * @param func function to be wrapped
 * @returns wrapped function
 */
export function callOnUpdatedArgs<F extends (...args: any[]) => any>(func: F): (...args: Parameters<F>) => ReturnType<F> {
    let prevArgs: Parameters<F> | undefined
    let prevAns: ReturnType<F> | undefined
    return (...args: Parameters<F>) => {
        if (prevArgs === undefined || !arrCmp(args, prevArgs)) {
            prevArgs = args
            prevAns = func(...args)
        }
        return prevAns as any
    }
}