import axios from 'axios'
export interface LoginUser {
  email: string
  firstName: string
  gender: string
  id: number
  image: string
  lastName: string
  token: string
  username: string
}
interface Credentials {
  username: string
  password: string
  expiresInMins?: number
}
function apiUrl(endpoint:string = ''): string {
  return import.meta.env.VITE_APP_API_URL + endpoint;
}

export function authHeaders(): { headers: Record<string, string> } {
  const token = getLoginUser()?.token;
  const header = { headers: {'Authorization': `Bearer ${token}`} }
  return header;
}

export const login = async (username: string, password: string): Promise<LoginUser | string > => {
  const url = apiUrl('auth/login')
  const params: Credentials = {
    username: username,
    password: password,
    expiresInMins: 60
  }
  try {
    const response = await axios.post(url, params)
    setLoginUser(response.data)
    return response.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw Error(error.response?.data.message)
    } else {
      throw Error('An error occurred')
    }
  }
}
export function logout() {
  localStorage.removeItem('user');
}

export async function refreshAuth(expiresInMins: number = 60) {
  const url = apiUrl(`auth/refresh`)
  const response = await axios.post(url, {expiresInMins: expiresInMins}, authHeaders());
  return response.data
}

export function setLoginUser(user: LoginUser): void {
  const jsonUser = JSON.stringify(user);
  localStorage.setItem('user', jsonUser);
}
function getLoginUser(): LoginUser | null {
  const jsonUser = localStorage.getItem('user');
  if(jsonUser !== null) {
    return JSON.parse(jsonUser) as LoginUser;
  }
  return null;
}