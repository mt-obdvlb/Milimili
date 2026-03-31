import cookieParser from 'cookie-parser'
import express, {
  type Express,
  type NextFunction,
  type Request,
  type Response,
  type Router,
} from 'express'
import request from 'supertest'
import { describe, expect, it, type Mock, vi } from 'vitest'
import { errorMiddleware } from '@/middlewares/error.middleware'

type RequestMethod = 'get' | 'post' | 'put' | 'delete'

type RouteExpectation = {
  body?: unknown
  params?: Record<string, string>
  query?: Record<string, string>
}

export type RouteContractCase = {
  controller: string
  body?: unknown
  method: RequestMethod
  path: string
  requiresAuth?: boolean
  usesValidation?: boolean
  expected?: RouteExpectation
  query?: Record<string, string | number | boolean>
}

export const TEST_USER = {
  id: 'test-user-id',
}

export const createRouteApp = (router: Router): Express => {
  const app = express()
  app.use(cookieParser())
  app.use(express.json())
  app.use(router)
  app.use(errorMiddleware)
  return app
}

export const createControllerMocks = <TNames extends readonly string[]>(
  names: TNames
): Record<TNames[number], Mock> =>
  Object.fromEntries(
    names.map((name) => [
      name,
      vi.fn((req: Request, res: Response) =>
        res.status(200).json({
          code: 0,
          handler: name,
        })
      ),
    ])
  ) as Record<TNames[number], Mock>

export const createMiddlewareMocks = () => {
  const authMiddleware = vi.fn((req: Request, res: Response, next: NextFunction) => {
    if (req.header('x-test-auth') === 'fail') {
      return res.status(401).json({
        code: 1,
        message: 'mock auth blocked',
      })
    }

    req.user = { ...TEST_USER }
    next()
  })

  const validatorMiddleware = vi.fn(() => (req: Request, res: Response, next: NextFunction) => {
    if (req.header('x-test-validation') === 'fail') {
      return res.status(400).json({
        code: 1,
        message: 'mock validation blocked',
      })
    }

    next()
  })

  return {
    authMiddleware,
    validatorMiddleware,
  }
}

export const createUtilsMockModule = () => ({
  asyncHandler:
    (handler: (req: Request, res: Response, next: NextFunction) => unknown) =>
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await handler(req, res, next)
      } catch (error) {
        next(error)
      }
    },
})

const sendRequest = async (
  app: Express,
  routeCase: RouteContractCase,
  headers?: Record<string, string>
) => {
  const req = request(app)[routeCase.method](routeCase.path)

  if (headers) {
    for (const [name, value] of Object.entries(headers)) {
      req.set(name, value)
    }
  }

  if (routeCase.query) {
    req.query(routeCase.query)
  }

  if (routeCase.body !== undefined) {
    req.send(routeCase.body as string | object)
  }

  return req
}

export const assertRouteContract = ({
  cases,
  controllerMocks,
  getApp,
}: {
  cases: RouteContractCase[]
  controllerMocks: Record<string, Mock>
  getApp: () => Express
}) => {
  it.each(cases)('$method $path routes to $controller', async (routeCase) => {
    const response = await sendRequest(getApp(), routeCase)

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      code: 0,
      handler: routeCase.controller,
    })

    const controllerMock = controllerMocks[routeCase.controller]
    expect(controllerMock).toBeDefined()
    expect(controllerMock).toHaveBeenCalledTimes(1)

    const [req] = controllerMock!.mock.calls[0] as [Request]

    if (routeCase.expected?.body !== undefined) {
      expect(req.body).toEqual(routeCase.expected.body)
    }

    if (routeCase.expected?.params !== undefined) {
      expect(req.params).toEqual(routeCase.expected.params)
    }

    if (routeCase.expected?.query !== undefined) {
      expect(req.query).toMatchObject(routeCase.expected.query)
    }

    if (routeCase.requiresAuth) {
      expect(req.user).toEqual(TEST_USER)
    } else {
      expect(req.user).toBeUndefined()
    }
  })

  const authCases = cases.filter((routeCase) => routeCase.requiresAuth)
  if (authCases.length > 0) {
    describe('auth guards', () => {
      it.each(authCases)('blocks unauthenticated $method $path', async (routeCase) => {
        const response = await sendRequest(getApp(), routeCase, {
          'x-test-auth': 'fail',
        })

        expect(response.status).toBe(401)
        expect(response.body).toEqual({
          code: 1,
          message: 'mock auth blocked',
        })
        expect(controllerMocks[routeCase.controller]).not.toHaveBeenCalled()
      })
    })
  }

  const validationCases = cases.filter((routeCase) => routeCase.usesValidation)
  if (validationCases.length > 0) {
    describe('validation guards', () => {
      it.each(validationCases)('blocks invalid $method $path', async (routeCase) => {
        const response = await sendRequest(getApp(), routeCase, {
          'x-test-validation': 'fail',
        })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({
          code: 1,
          message: 'mock validation blocked',
        })
        expect(controllerMocks[routeCase.controller]).not.toHaveBeenCalled()
      })
    })
  }
}
