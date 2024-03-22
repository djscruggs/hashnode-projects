import { useState } from 'react'


function App() {
  const [password, setPassword] = useState('')
  const [passwordCheck, setPasswordCheck] = useState('')
  
  const validPassword = (password: string) => {
    const length: boolean = password.length > 9;
    const caps: boolean = /[A-Z]/.test(password)
    const lower: boolean = /[a-z]/.test(password)
    const numeral: boolean = /[0-9]/.test(password)
    const special: boolean = /[@#$%!^&*]/.test(password)
    const valid: boolean = length && caps && lower && special && numeral  
    return {length, caps, lower, numeral, special, valid}
  }
  const passwordsMatch = () => password === passwordCheck; 
  const {valid, length, caps, lower, numeral, special} = validPassword(password)
  return (
    <>
      
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Real-time Password Verification</h1>
        <p className="text-sm text-gray-500">
          Read the full tutorial <a className="text-blue-500 underline" href="https://djscruggs.hashnode.dev/real-time-password-verification-in-react">here</a>.
        </p>
      </div>
        <fieldset className='border border-gray-200 rounded-md p-8'>
          <legend>Password</legend>
          <ul className={`list-inside list-disc mb-4 ${password && !valid ? "text-red-500" : ""} text-left`}>
            <li className={password && length ? "text-green-400" : ""}>at least 10 characters</li>
            <li className={password && lower ? "text-green-400" : ""}>at least 1 lowercase letter</li>
            <li className={password && caps ? "text-green-400" : ""}>at least 1 uppercase letter</li>
            <li className={password && numeral ? "text-green-400" : ""}>at least 1 numeral</li>
            <li className={password && special ? "text-green-400" : ""}>at least 1 special character (@#$%!^&*)</li>
          </ul>
          <div className='text-left mb-4'>
          <label htmlFor="password" className='mb-1 block'>Password</label>
          
            <input
              name="password"
              type="password"
              id="password"
              className={(!password || valid) ?  "border border-black" : "border border-red-500"}
              onChange={(e)=>setPassword(e.target.value)}
            />
          </div>
          
          <div className='text-left mb-2'>
            <label htmlFor="password_check" className='block mb-1'>Repeat password</label>
            
              <input
                name="passwordCheck"
                type="password"
                id="passwordCheck"
                className={(!password || valid) ?  "border border-black" : "border border-red-500"}
                onChange={(e)=>setPasswordCheck(e.target.value)}
              />
              {!passwordsMatch() &&
                <p className='mt-1 text-sm text-red-500'>Passwords do not match</p>
              }
          </div>
        </fieldset>
          
    </>
  )
}

export default App
