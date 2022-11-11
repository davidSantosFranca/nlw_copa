import { Center, Icon, Text, theme } from "native-base";

import {Button} from "../components/Button";
import {Fontisto} from '@expo/vector-icons'
import { useAuth } from "../hooks/useAuth";
import Logo from "../components/Logo";
function SignIn(){
  const {signIn, isUserLoading} = useAuth();

  return(
  <Center 
    flex={1} 
    bgColor="gray.900" 
    alignItems="center"
    justifyContent={"center"}
    p={7}
  >
    <Logo width={212} height={40}/>
    <Button 
      title="Entrar com Google"
      type= 'SECONDARY'
      mt={12}
      leftIcon={<Icon as={Fontisto} name="google" color="white" size="md"/>}
      onPress={() => signIn()}
      isLoading={isUserLoading}
      _loading={{_spinner:{color: 'white'}}}
    /> 
    <Text color="white" textAlign="center" mt={4} px={4}>
      Não utilizamos nenhuma informação além{'\n'}do seu e-mail para criação de sua conta.
      </Text>
  </Center>
  )
}

export default SignIn;