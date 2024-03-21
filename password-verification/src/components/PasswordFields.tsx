import { useState } from 'react'

export function PasswordFields(): JSX.Element {

const [password, setPassword] = useState('')
const [passwordCheck, setPasswordCheck] = useState('')
//helper functions to check whether the password passes all checks
const isValid = () => validPassword(password).valid; 
const passwordsMatch = () => password === passwordCheck; 
return (
  <fieldset>
    <legend>Password</legend>
    <PasswordDescription password={password} />
    <div>
      <label htmlFor="password">Password</label>
      <div>
        <input
          name="password"
          type="password"
          id="password"
          className={isValid() ?  "border border-black" : "border border-red-500"}
          onChange={(e)=>setPassword(e.target.value)}
        />
      </div>
    </div>
    <div>
      <label htmlFor="password_check">Repeat password</label>
      <div>
        <input
          name="passwordCheck"
          type="password"
          id="passwordCheck"
          className={passwordsMatch() ?  "border border-black" : "border border-red-500"}
          onChange={(e)=>setPasswordCheck(e.target.value)}
         />
      </div>
    </div>
  </fieldset>
  )
}
type PasswordDescriptionProps = {
  password: string | undefined
}

export const PasswordDescription = ({password = ''}: PasswordDescriptionProps) => {
  const {valid, length, caps, lower, numeral, special} = validPassword(password)
  return (
        <ul className={`list-disc ${password && !valid ? "text-red-500" : ""}`}>
          <li className={password && length ? "text-green-400" : ""}>at least 10 characters</li>
          <li className={password && lower ? "text-green-400" : ""}>at least 1 lowercase letter</li>
          <li className={password && caps ? "text-green-400" : ""}>at least 1 uppercase letter</li>
          <li className={password && numeral ? "text-green-400" : ""}>at least 1 numeral</li>
          <li className={password && special ? "text-green-400" : ""}>at least 1 special character (@#$%!^&*)</li>
        </ul>
    )
}
export const validPassword = (password: string) => {
  const length: boolean = password.length > 9;
  const caps: boolean = /[A-Z]/.test(password)
  const lower: boolean = /[a-z]/.test(password)
  const numeral: boolean = /[0-9]/.test(password)
  const special: boolean = /[@#$%!^&*]/.test(password)
  const valid: boolean = length && caps && lower && special && numeral  
  return {length, caps, lower, numeral, special, valid}
}