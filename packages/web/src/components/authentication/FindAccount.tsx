
import React, { useState, useRef, useCallback } from 'react'
import { Form } from '..'
import { useAuth } from '../../providers'

export default function FindAccountForm({ setPage }) {
  const { resetPassword } = useAuth(),
    [error, setError] = useState(''),
    emailRef = useRef<HTMLInputElement>(null)
  const handleSubmit = useCallback(async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    // console.log('Form Submitted', emailRef.current.value, passwordRef.current.value)
    try {
      await resetPassword(emailRef.current.value)
    } catch (error) {
      setError(error.message)
    }
  }, [])

  return <>
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <img className="mx-auto h-12 w-auto" src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg" alt="Shadyantra Logo" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Find Your Account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Remember your account? { }
            <button onClick={ () => setPage('sign-in') } className="font-medium text-indigo-600 hover:text-indigo-500"> Sign in</button>
          </p>
        </div>
        { error && <p className='text-red-500 text-sm'>{ error }</p> }
        <Form onSubmit={ handleSubmit }>
          <div className="border border-gray-300 divide-y divide-gray-300 rounded-md shadow-sm">
            <Form.Field ref={ emailRef } type='email' required placeholder='Email Address' />
          </div>
          <Form.Submit title='Search Account' />
        </Form>
      </div>
    </div>
  </>
}