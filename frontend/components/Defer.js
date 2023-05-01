"use strict";

/*
 Returns a promise that can be externally resolved.
 Example:
   const promise = defer()
   promise.resolve("value")
   const value = await promise
 */
const Defer = () => {
    let deferred = {
        promise: null,
        resolve: null,
        reject: null
    }

    deferred.promise = new Promise((resolve, reject) => {
        deferred.resolve = resolve;
        deferred.reject = reject;
    })

    return deferred
}

export default Defer