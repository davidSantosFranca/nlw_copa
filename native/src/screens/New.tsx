import Clipboard from "@react-native-community/clipboard";
import { Heading, Text, useToast, VStack } from "native-base";
import { useState } from "react";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import Logo from "../components/Logo";
import { createPoll } from "../services/api";

function New() {
  const [title, setTitle] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const toast = useToast();
  return ( 
  <VStack flex={1} bg={'gray.900'} >
    <Header title='Criar novo bolão'/>
    <VStack mt={8} mx={5} alignItems='center'>
      <Logo />
      <Heading fontFamily={'heading'} color={'white'} fontSize={'xl'} textAlign='center' my={8}>
        Crie seu próprio bolão da copa e compartilhe entre amigos!
      </Heading>
      <Input 
        mb={2} 
        placeholder={"Qual o nome do seu bolão?"}
        value={title}
        onChangeText={setTitle} 
      />

      <Button title="CRIAR MEU BOLÃO" onPress={handlePollCreate} isLoading={isPosting}/>

      <Text color="gray.500" fontSize="sm" textAlign="center" px={10} mt={4}>
        Após criar seu bolão, você receberá um código único 
        que poderá usar para convidar outras pessoas.
      </Text>
    </VStack>
  </VStack> );

  async function handlePollCreate(){
    if(!title.trim()){
      return toast.show({
        title:"Por favor informe o nome para o bolão!",
        placement:'top',
        bgColor:"red.400",
      })
    }
    try {
      setIsPosting(true);
      const newPollResponse = await createPoll(title.trim());
      toast.show({
        title:`Bolão ${title} criado com sucesso! Código ${newPollResponse.data.poll} copiado!`,
        placement:'top',
        bgColor:"green.600",
      })
      setTitle('');
    } catch (error) {
      console.log(error);
      toast.show({
        title:"Não foi possivel criar o bolão!",
        placement:'top',
        bgColor:"red.400",
      })
    }
    finally{
      setIsPosting(false)
    }
  }
}

export default New;