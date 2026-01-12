type Deferred<T> = {
    promise: Promise<T>,
    resolve: (value: T) => void,
    reject: (error: Error) => void
}

/*
 Returns a promise that can be externally resolved.
 Example:
   const promise = defer()
   promise.resolve("value")
   const value = await promise
 */
const Defer = <T,>(): Deferred<T> => {
    let resolveFunc: ((value: T) => void) | undefined;
    let rejectFunc: ((error: Error) => void) | undefined;

    const promise = new Promise<T>((resolve, reject) => {
        resolveFunc = resolve;
        rejectFunc = reject;
    });

    // These are guaranteed to be set after Promise constructor runs
    return {
        promise,
        resolve: resolveFunc!,
        reject: rejectFunc!,
    };
}

export default Defer
