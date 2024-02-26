'use client'
import React from 'react'
import { toast } from 'sonner'
import { useFormState } from 'react-dom'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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

  React.useEffect(() => {
    if (state.message) {
      toast.error(state.message, {
        position: 'top-center',
      })
    }
  }, [state])

  return (
    <div className="mx-auto w-[600px] translate-y-32">
      <Card className="py-4">
        <CardHeader className="mb-2 text-center">
          <CardTitle>登录</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col items-center" action={dispatch}>
            <div className="relative w-full px-10 pb-6">
              <div className="flex w-full items-center">
                <Label className="mr-2 w-24 text-right text-xl" htmlFor="username">
                  用户名
                  <abbr className="text-orange-300 no-underline" title="required">
                    *
                  </abbr>
                </Label>
                <Input required type="text" id="username" name="username" placeholder="请输入..." />
              </div>
              {state.errors.username && (
                <div className="absolute bottom-0.5 w-96 pl-16 text-sm text-red-500">
                  {state.errors.username.join(',')}
                </div>
              )}
            </div>
            <div className="relative w-full px-10 pb-6">
              <div className="flex w-full items-center">
                <Label className="mr-2 w-24 text-right text-xl" htmlFor="password">
                  密码
                  <abbr className="text-orange-300 no-underline" title="required">
                    *
                  </abbr>
                </Label>
                <Input
                  required
                  id="password"
                  type="password"
                  name="password"
                  placeholder="请输入..."
                />
              </div>
              {state.errors.password && (
                <div className="absolute bottom-0.5 w-96 pl-16 text-sm text-red-500">
                  {state.errors.password.join(',')}
                </div>
              )}
            </div>
            <Button type="submit" className="btn btn-primary mt-4 px-10 text-xl">
              登录
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginForm
