
import React, { useState, useRef, useCallback } from 'react'
import { Form } from '..'
import { useAuth } from '../../providers'

export default function SignUpForm({ setPage }) {
  const { signup } = useAuth(),
    [error, setError] = useState(''),
    nameRef = useRef<HTMLInputElement>(null),
    emailRef = useRef<HTMLInputElement>(null),
    passwordRef = useRef<HTMLInputElement>(null),
    confirmPasswordRef = useRef<HTMLInputElement>(null)
  // [email, setEmail] = useState(''),
  // [password, setPassword] = useState('')
  const handleSubmit = useCallback(async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    console.log('Form Submitted', emailRef.current.value, passwordRef.current.value)
    try {
      if (passwordRef.current.value != confirmPasswordRef.current.value)
        throw new Error("Passwords don't match.")

      const user = await signup(emailRef.current.value, passwordRef.current.value)
      await user.updateProfile({
        displayName: nameRef.current.value
      })
    } catch (error) {
      setError(error.message)
    }
  }, [])

  return <>
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <img className="mx-auto h-12 w-auto" src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg" alt="Shadyantra Logo" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create a new Account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Already have an account? { }
            <button onClick={ () => setPage('sign-in') } className="font-medium text-indigo-600 hover:text-indigo-500"> Sign in</button>
          </p>
        </div>
        { error && <p className='text-red-500 text-sm'>{ error }</p> }
        <Form onSubmit={ handleSubmit }>
          <div className="border border-gray-300 divide-y divide-gray-300 rounded-md shadow-sm">
            <Form.Field ref={ nameRef } type='text' required placeholder='Your Name' />
            <Form.Field ref={ emailRef } type='email' required placeholder='Email Address' />
            <Form.Field ref={ passwordRef } type='password' required placeholder='Password' />
            <Form.Field ref={ confirmPasswordRef } type='password' required placeholder='Confirm Password' />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id='remember-me' name="remember_me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label htmlFor='remember-me' className="select-none ml-2 block text-sm text-gray-900">Remember me</label>
            </div>

            <div className="text-sm">
              <button onClick={ () => setPage('find-account') } className="font-medium text-indigo-600 hover:text-indigo-500">Forgot your password?</button>
            </div>
          </div>
          <Form.Submit title='Create Account' />
        </Form>
      </div>
    </div>
  </>
}