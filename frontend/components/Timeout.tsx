// A Promise that resolves after a given timeout
export const timeout = (delayMs: number): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, delayMs)
    })
}

export const promiseWithTimeout = async <T,>(promise: Promise<T>, waitMsUntilCancelled: number): Promise<T> => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined = undefined
    const failureCase: Promise<T> = new Promise((_resolve, reject) => {
        timeoutId = setTimeout(() => reject(new Error("Timeout waiting for promise")), waitMsUntilCancelled)
    })
    const successCase: Promise<T> = promise.finally(() => {
        clearTimeout(timeoutId)
    })

    return await Promise.race([successCase, failureCase])
}
