type Deferred<T> = {
    promise?: Promise<T>,
    resolve?: (value: T) => void,
    reject?: (error: Error) => void
}

/*
 Returns a promise that can be externally resolved.
 Example:
   const promise = defer()
   promise.resolve("value")
   const value = await promise
 */
const Defer = <T,>() => {
    let deferred: Deferred<T> = {
        promise: undefined,
        resolve: undefined,
        reject: undefined,
    }

    deferred.promise = new Promise((resolve, reject) => {
        deferred.resolve = resolve;
        deferred.reject = reject;
    })

    return deferred
}

export default Defer
