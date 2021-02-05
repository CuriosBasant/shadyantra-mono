import React from 'react'
import { NavBar } from '.'

type Props = {
  title: string
  children: React.ReactNode
}
export default function Page({ title, children }: Props) {
  return <>
    <NavBar />
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold leading-tight text-gray-900">{ title }</h1>
      </div>
    </header>
    <main>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          { children ? children :
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96"></div>
          }
        </div>
      </div>
    </main>
    <footer>
    </footer>
  </>
}