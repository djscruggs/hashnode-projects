import { useState, useEffect } from 'react'
import { login, logout, LoginUser, refreshAuth, reLogin } from './api'
import exp from 'constants'

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [timer, setTimer] = useState(600)
  const [user, setUser] = useState<LoginUser | null>(null)
  const [refreshed, setRefreshed] = useState(false)
  
  const manualRefresh = async () => {
    if(!user) {
      setError('No user to refresh')
      return
    }
    try {
      const data = await refreshAuth()
      console.log('result from refresh', data)
      setTimer(600)
      setRefreshed(true)
    } catch (error) {
      console.error('error', error)
      setUser(null)
    }
    
  }
  useEffect(() => {
    let countdown: NodeJS.Timeout | null = null;
    if(user) {
      countdown = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000); // 1000 milliseconds = 1 second

      return () => clearInterval(countdown);
    } else {
      setTimer(600)
      clearInterval(countdown)
    }
  }, [user]);

  
  useEffect(() => {
    const refreshToken = async () => {
      if(!user) {
        clearInterval(refreshInterval)
        return
      }
      try {
        const data = await refreshAuth()
        console.log('result from refresh', data)
        setRefreshed(true)
      } catch (error) {
        setRefreshed(false)
        console.error('error', error)
        setUser(null)
      }
    };

    const refreshInterval = setInterval(refreshToken, 600000); // 600000 milliseconds = 10 minutes

    return () => clearInterval(refreshInterval);
  }, [user]);
  const formatTime = (time:number):string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  const doLogin = async () => {
    const result = await login(username, password)
    if(typeof result === 'string') {
      setError(result)
    } else {
      setUser(result)
      setError('')
    }
  }
  
  

  const doLogout = () => {
    logout()
    setUser(null)
    setRefreshed(false)
  }
  return (
    <div className='flex justify-center items-center min-h-screen w-screen'>
      <div className='flex flex-col border justify-center border-gray-200 rounded-md p-8 my-8 max-w-[50%]'>
        <h1>Persistent Auth State Example</h1>
        <button className='my-8' onClick={manualRefresh}>Manually refresh Token</button>
        {user && refreshed && <p className='text-green-500 my-4'>Token refreshed. Check JavaScript console to see it</p>}
        {user && 
          <p>Token auto-refresh in: {formatTime(timer)}</p>
        }
        {user && 
          <div className='flex flex-col items-left px-20'>
            <p className='text-center my-4'>Welcome {user.firstName}!</p>
            <div>
              <div className='text-sm overflow-hidden mb-8'>
                {Object.keys(user).map(key => {
                  return <div className="flex" key={key}>
                    <div className="w-1/2 text-right mr-2 mb-2">{key}:</div>
                    <div className="w-1/2 text-left ml-2 mb-2 overflow-scroll"> 
                      {key !== 'token' ? (
                         typeof user[key as keyof LoginUser] !== 'object' && 
                         <>{user[key as keyof LoginUser]}</>
                      ) : (
                        <textarea className='w-full h-80'>
                          {user[key]}
                        </textarea>
                      )}
                    </div>
                  </div>
                })}
              </div>
            </div>
            <button onClick={doLogout}>Logout</button>
          </div>
        }
        {!user &&
          <div className='flex flex-col items-left px-20'>
            <div className='flex flex-col items-left px-20 my-8'>
            <p>Enter these credentials below:</p>
            <p>username: <strong>kminchelle</strong></p>
            <p>password: <strong>0lelplR</strong></p>
            </div>
            {error && <p className='text-center text-red-500'>{error}</p>}
            <label className='block mb-2'>Username</label>
            <input className="max-w-100 border border-gray-200 rounded-md p-2 mb-4" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            <label className='block mb-2'>Password</label>
            <input className="max-w-100 border border-gray-200 rounded-md p-2 mb-4" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button className='bg-blue-500 text-white p-2 rounded-md m-2' onClick={doLogin}>Login</button>
          </div>
        }
      </div>
      
    </div>
  )
}

export default App
