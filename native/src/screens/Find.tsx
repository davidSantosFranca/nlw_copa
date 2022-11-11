import { useFocusEffect } from "@react-navigation/native";
import { Heading, useToast, VStack } from "native-base";
import { useCallback, useState } from "react";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { joinPollByCode } from "../services/api";

function Find() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [pollCode, setPollCode] = useState('');

  useFocusEffect(useCallback(()=>{
    setPollCode('');
  },[]))
  return ( 
  <VStack flex={1} bg={'gray.900'} >
    <Header title='Buscar por código' showBackButton/>
    <VStack mt={8} mx={5} alignItems='center'>
      <Heading fontFamily={'heading'} color={'white'} fontSize={'xl'} textAlign='center' mb={8}>
        Encontre um bolão através {'\n'}de seu código único
      </Heading>
      <Input 
        mb={2} 
        autoCapitalize={'characters'}
        placeholder={"Qual o código do bolão?"}
        defaultValue={pollCode}
        maxLength={6}
        onChangeText={setPollCode}
      />
      <Button 
        title="ENTRAR NO BOLÃO" 
        isLoading={isLoading}
        onPress={handleJoinPoll}
      />
    </VStack>
  </VStack> );

  async function handleJoinPoll(){
    try {
      await joinPollByCode(pollCode.toUpperCase()).then(x=>{
        if(!x.data.poll){
          toast.show({
            title: 'Bolão não encontrado!!!',
            placement: 'top',
            bgColor:'red.400'
          })
          return;
        }
        if(x.data.message==='You already are participating in this poll!'){
          toast.show({
            title: 'Você já esta neste bolão!',
            placement: 'top',
            bgColor:'red.400'
          })
          return;
        }
      
        toast.show({
            title: `Sucesso ao entrar no bolão! Participantes: ${x.data.participantsCount+1}`,
            placement: 'top',
            bgColor:'green.500'
          })
    })
    .catch((err) => {
      console.log(err);
      setIsLoading(true);
      if(err.data.message==='You already are participating in this poll!'){
          toast.show({
            title: 'Você já esta neste bolão!',
            placement: 'top',
            bgColor:'red.400'
          })
          return;
        }
      toast.show({
          title: 'Erro ao buscar bolão',
          placement: 'top',
          bgColor:'red.400'
        })
    })
    .finally(()=>{
      setPollCode('');
      setIsLoading(false);
    })
    } catch (error) {
      console.debug(error);
      toast.show({
          title: 'Erro ao buscar bolão',
          placement: 'top',
          bgColor:'red.400'
        })
    }
  }
}

export default Find;