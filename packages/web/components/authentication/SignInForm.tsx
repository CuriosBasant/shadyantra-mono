import React, { useState, useRef, useCallback } from 'react'
import { Form } from '..'
import { useAuth } from '../../providers'

export default function SignInForm({ setPage }) {
  const { signin } = useAuth(),
    [error, setError] = useState(''),
    emailRef = useRef<HTMLInputElement>(null),
    passwordRef = useRef<HTMLInputElement>(null)
  // [email, setEmail] = useState(''),
  // [password, setPassword] = useState('')
  const handleSubmit = useCallback((ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    console.log('Form Submitted', emailRef.current.value, passwordRef.current.value)
    signin(emailRef.current.value, passwordRef.current.value)
      .catch(err => setError(err.message))
  }, [])

  return <>
    <datalist id='email-list'>
      <option value='don@horn.com' />
    </datalist>
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <img className="mx-auto h-12 w-auto" src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg" alt="Shadyantra Logo" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900"> Sign in to your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Or { }
            <button onClick={ () => setPage('sign-up') } className="font-medium text-indigo-600 hover:text-indigo-500"> Create a new Account</button>
          </p>
        </div>
        { error && <p className='text-red-500 text-sm'>{ error }</p> }
        <Form onSubmit={ handleSubmit }>
          <div className="border border-gray-300 divide-y divide-gray-300 rounded-md shadow-sm">
            <Form.Field ref={ emailRef } type='email' required placeholder='Email Address' />
            <Form.Field ref={ passwordRef } type='password' required placeholder='Password' />
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
          <Form.Submit title='Sign in' />
        </Form>
      </div>
    </div>
  </>
}