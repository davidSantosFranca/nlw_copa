import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { FlatList, useTheme, useToast, VStack } from "native-base";
import { MagnifyingGlass } from "phosphor-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "../components/Button";
import { EmptyPoolList } from "../components/EmptyPoolList";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { PollCard, PollCardProps } from "../components/PollCard";
import { getParticipatingPolls } from "../services/api";

function Polls() {
  const {navigate, ...navigation} = useNavigation();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [polls, setPolls] = useState<PollCardProps[]>([]);

  const {sizes} = useTheme();

  useFocusEffect(useCallback(()=>{
    fetchPolls();
  },[]))
  return ( 
  <VStack flex={1} bg={'gray.900'}>
    <Header title='Meus bolões'/>
    <VStack mt={6} mx={5} borderBottomWidth={1} borderBottomColor={'gray.200'} pb={4} mb={4}>
      <Button 
        leftIcon={<MagnifyingGlass size={24} color={"black"}/>} 
        title={'BUSCAR BOLÃO POR CÓDIGO'}
        onPress={() => navigate('find')}
      ></Button>
    </VStack>
    {isLoading? 
        <Loading/>
        :<FlatList 
          data={polls} 
          keyExtractor={item=> item.id} 
          renderItem={({item})=>
            <PollCard 
              data={item}
              onPress={()=>navigate('details', {id: item.id})}
            />}
          ListEmptyComponent={EmptyPoolList}
          pt={2}
          px={5}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{pb:sizes[8], }}
          />}
  </VStack>);

  async function fetchPolls(){
    try {
      setIsLoading(true);
      setPolls([])
      const pollsRes = await getParticipatingPolls();
      setPolls(pollsRes.data.participatingPolls);
    } catch (error) {
      console.error(error);
      toast.show({
        title:'Não foi possivel carregar os bolões',
        placement: 'top',
        bgColor: 'red.500'
      })
    }
    finally {
      setIsLoading(false);
    }
  }
}

export default Polls;