// A Promise that resolves after a given timeout
export const timeout = (delayMs: number): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, delayMs)
    })
}

export const promiseWithTimeout = async <T,>(promise: Promise<T>, waitMsUntilCancelled: number): Promise<T> => {
    let timeoutId: any = undefined
    const failureCase: Promise<T> = new Promise((resolve, reject) => {
        timeoutId = setTimeout(() => reject("Timeout waiting for promise"), waitMsUntilCancelled)
    })
    const successCase: Promise<T> = promise.finally(() => {
        clearTimeout(timeoutId)
    })

    return await Promise.race([successCase, failureCase])
}
