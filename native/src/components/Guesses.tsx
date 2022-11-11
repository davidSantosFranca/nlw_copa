import { Box, FlatList, useTheme, useToast } from 'native-base';
import { useEffect, useState } from 'react';
import { getPollGames, makeGuess } from '../services/api';
import { EmptyMyPoolList } from './EmptyMyPoolList';
import { Game, GameProps } from './Game';
import { Loading } from './Loading';

interface Props {
  pollId: string;
  code: string;
}

export function Guesses({ pollId, code }: Props) {
  const toast = useToast();
  const {sizes} = useTheme();
  const [isLoading, setIsLoading] = useState(false)
  const [games, setGames] = useState<GameProps[]>([])
  const [firstTeamPoints, setFirstTeamPoints] = useState("")
  const [secondTeamPoints, setSecondTeamPoints] = useState("")


  useEffect(() => {
    setIsLoading(true);
    getPollGames(pollId).then(res=>{
      console.log(res.data);
      setGames(res.data.games);
    })
    .catch(error=>{
      console.log(error);
      toast.show({
        title:"Erro ao carregar jogos",
        bgColor:"red.400",
        placement:'top'
      })
    })
    .finally(()=>{
      setIsLoading(false);
    });
  }, [])

  return (
    <Box>
      {
        isLoading?<Loading/>
        : <FlatList
          data={games} 
          keyExtractor={item=> item.id} 
          renderItem={({item})=>
            <Game  
              data={item} 
              onGuessConfirm={()=>handleMakeGuess(item)} 
              setFirstTeamPoints={(value: string)=> {
                setFirstTeamPoints(value)
              }} 
              setSecondTeamPoints={(value: string)=>{
                setSecondTeamPoints(value);
              } }              
            />}
          pt={2}
          px={5}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{pb:sizes[8] }}
          ListEmptyComponent={()=><EmptyMyPoolList code={code}/>}
        />
      }
    </Box>
  );

  function handleMakeGuess(game:GameProps){
    try {
      setIsLoading(true);
      makeGuess(pollId, game.id, Number(firstTeamPoints), Number(secondTeamPoints))
      .then((res)=>{
        toast.show({
          title:'Palpite feito!',
          placement: 'top',
          bgColor:'green.500'
        });

        setGames(prev=> ({...prev, guess:{firstTeamPoints:Number(firstTeamPoints), secondTeamPoints: Number(secondTeamPoints)}}))
      })
      .catch(error=>{
        console.log(error);
        toast.show({
          title:"Erro ao carregar jogos",
          bgColor:"red.400",
          placement:'top'
        })
      })
      .finally(()=>{
        setIsLoading(false);
      });
    } catch (error) {
      console.log(error)
    }
  }
}
