import { createContext, ReactNode, useState, useEffect } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import { getCurrentUserData, signInWithBackEnd, updateAuthToken } from '../services/api';
interface UserProps{
  name:string;
  avatarUrl:string;
}
export interface AuthContextDataProps{
  user:UserProps;
  isUserLoading:boolean;
  signIn: ()=> Promise<void>;
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

interface AuthContextProviderProps{
  children: ReactNode
}
export function AuthContextProvider({children}:AuthContextProviderProps){
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [user, setUser] = useState({} as UserProps)
  const[request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.GOOGLE_CLIENT_ID,
    redirectUri:AuthSession.makeRedirectUri({useProxy:true}),
    scopes:['profile', 'email']
  })

  useEffect(() =>{
    if(response && response.type==='success' && response.authentication?.accessToken){
      signInWithGoogle(response.authentication.accessToken)
    }
  }, [response])

  return (
    <AuthContext.Provider value={{
      signIn,
      isUserLoading,
      user
    }}>
      {children}
    </AuthContext.Provider>
  )
  

  async function signIn(){
    try {
      setIsUserLoading(true);
      await promptAsync();
    } catch (error) {
      console.log(error);
      throw error;
    }
    finally{
      setIsUserLoading(false);
    }
  }

  async function signInWithGoogle(access_token:string){
    try {
      setIsUserLoading(true);
      const tokenRes = await signInWithBackEnd(access_token);
      updateAuthToken(tokenRes.data.token);

      const userInfoResponse = await getCurrentUserData();
      setUser(userInfoResponse.data.user);

    } catch (error) {
      console.log(error);
      throw error;
    }
    finally {
      setIsUserLoading(false);
    }
  }
}