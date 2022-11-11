import { useFocusEffect, useRoute } from "@react-navigation/native";
import {Share} from "react-native"
import { HStack, useToast, VStack } from "native-base";
import React, { useCallback, useState } from "react";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { Option } from "../components/Option";
import { PollCardProps } from "../components/PollCard";
import { PollHeader } from "../components/PollHeader";
import { getPollById } from "../services/api";
import { Guesses } from "../components/Guesses";
import { handleShare } from "../services/utils";
interface RouteParams{
  id: string;
}
function Details() {
  const route = useRoute();
  const toast = useToast();

  const { id } = route.params as RouteParams;
  const [isLoading, setIsLoading] = useState(true);
  const [pollDetails, setPollDetails] = useState<PollCardProps>(null)
  const [selectedSubMenu, setSelectedSubMenu] = useState<'ranking'|'guesses'>('guesses')

  useFocusEffect(useCallback(()=>{
    setIsLoading(true);
    getPollById(id).then(res=>{ 
      setPollDetails(res.data.poll)
    })
    .catch(error=>{
      console.log(error);
      toast.show({
        title:"Erro ao carregar detalhes",
        bgColor:"red.400",
        position:'top'
      })
    })
    .finally(()=>{
      setIsLoading(false);
    });
  },[]))

  return ( 
  <VStack flex={1} bgColor={'gray.900'}>
    {isLoading ? <Loading/> : 
    <>
      <Header title={pollDetails.title} showBackButton showShareButton onShare={()=>handleShare(pollDetails.code)}/>
      {
        pollDetails._count?.participants>0
        ?<VStack>
          <PollHeader data={pollDetails}/>

          <HStack >
            <Option 
              title={"Seus Palpites"} 
              isSelected={selectedSubMenu==='guesses'} 
              onPress={()=>setSelectedSubMenu('guesses')}
            />
            <Option 
              title={"Ranking do grupo"} 
              isSelected={selectedSubMenu==='ranking'} 
              onPress={()=> setSelectedSubMenu('ranking')}
            />
          </HStack>
          <Guesses pollId={pollDetails.id} code={pollDetails.code}/>
        </VStack>
        :<EmptyMyPoolList code={pollDetails.code} key={pollDetails.id}/>
      }
    </> }
  </VStack> );
}

export default Details;