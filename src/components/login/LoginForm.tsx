'use client'

import { message } from 'antd'
import React, { useEffect } from 'react'
import { useFormState } from 'react-dom'

type State = {
  errors: {
    username?: string[]
    password?: string[]
  }
  message?: string
}

interface LoginFormProps {
  login: (username: string, password: string) => Promise<void>
}

const LoginForm: React.FC<LoginFormProps> = ({ login }) => {
  const action = async (_: State, formData: FormData) => {
    const username = formData.get('username')
    const password = formData.get('password')
    const state: State = {
      errors: {},
    }
    if (!username) {
      state.errors.username = ['用户名不能为空']
    }
    if (!password) {
      state.errors.password = ['密码不能为空']
    }
    if (Object.keys(state.errors).length === 0) {
      try {
        await login(username!.toString(), password!.toString())
      } catch (error) {
        state.message = '用户名或密码错误'
      }
    }
    return state
  }

  const [state, dispatch] = useFormState(action, { errors: {} })

  useEffect(() => {
    if (state.message) {
      message.error(state.message)
    }
  }, [state])

  return (
    <div className="mx-auto w-[500px] translate-y-24 rounded border px-4 py-8">
      <h1 className="pb-8 text-center text-4xl leading-loose">登录</h1>
      <form className="flex flex-col items-center" action={dispatch}>
        <div className="relative pb-6">
          <div className="flex w-96 items-center">
            <label className="mr-2 w-14 text-right" htmlFor="username">
              用户名
            </label>
            <input
              required
              type="text"
              id="username"
              name="username"
              className="flex-grow rounded px-2 py-1"
            />
          </div>
          {state.errors.username && (
            <div className="absolute bottom-0.5 w-96 pl-16 text-sm text-red-500">
              {state.errors.username.join(',')}
            </div>
          )}
        </div>
        <div className="relative pb-6">
          <div className="flex w-96 items-center">
            <label className="mr-2 w-14 text-right" htmlFor="password">
              密码
            </label>
            <input
              required
              id="password"
              type="password"
              name="password"
              className="flex-grow rounded px-2 py-1"
            />
          </div>
          {state.errors.password && (
            <div className="absolute bottom-0.5 w-96 pl-16 text-sm text-red-500">
              {state.errors.password.join(',')}
            </div>
          )}
        </div>
        <button
          type="submit"
          className="mt-2 rounded bg-gray-100 px-10 py-2 transition-[background] hover:bg-gray-300"
        >
          登录
        </button>
      </form>
    </div>
  )
}

export default LoginForm
