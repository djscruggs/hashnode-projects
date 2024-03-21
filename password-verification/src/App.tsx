import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './output.css'
import { PasswordFields} from './components/PasswordFields'

function App() {
  

  return (
    <>
      
      <div className="flex flex-col items-center justify-center mb-4">
        <h1 className="text-2xl font-bold">Real-time Password Verification</h1>
        <p className="text-sm text-gray-500">
          Read the full tutorial <a className="text-blue-500 underline" href="https://djscruggs.hashnode.dev/real-time-password-verification-in-react">here</a>.
        </p>
      </div>
      <div className="text-left border border-gray-200 rounded-md p-8">
        <PasswordFields />
      </div>
      
    </>
  )
}

export default App
