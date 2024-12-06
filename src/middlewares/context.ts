import { AsyncLocalStorage } from 'async_hooks'
import { Request, Response, NextFunction } from "express";


const asyncLocalStorage = new AsyncLocalStorage<Map<string, any>>()

const contextMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    asyncLocalStorage.run(new Map(), () => {
        const store = asyncLocalStorage.getStore()
        if (store) {
            const language: string = req.headers['accept-language'] || 'en'
            const token = req.headers['authorization'] || null

            store.set('language', language)
            store.set('token', token)
        }
        next()
    })
}

function getContextValue<T>(key: string): T | undefined {
    const store = asyncLocalStorage.getStore()
    return store?.get(key)
}

export { contextMiddleware, getContextValue }