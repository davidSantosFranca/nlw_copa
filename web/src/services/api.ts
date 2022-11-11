import axios from 'axios';

const api = axios.create({
  baseURL:'http://localhost:3333/'
})

interface GetCount{
  count:number
}
export function poolsCount():Promise<number>{
  return new Promise<number>((resolve, reject) =>{ 
    api.get<GetCount>('polls/count')
    .then((res) => resolve(res.data.count))
    .catch((err) => reject(err))}
  )
}
export function usersCount():Promise<number>{
  return new Promise<number>((resolve, reject) =>{ 
    api.get<GetCount>('users/count')
    .then((res) => resolve(res.data.count))
    .catch((err) => reject(err))}
  )
}
export function guessesCount():Promise<number>{
  return new Promise<number>((resolve, reject) =>{ 
    api.get<GetCount>('guesses/count')
    .then((res) => resolve(res.data.count))
    .catch((err) => reject(err))}
  )
}

interface PoolPost{
  title: string
}
interface PoolPostRes{
  poll:string
}
export function poolPost({title}:PoolPost):Promise<string>{
  return new Promise((resolve, reject) =>{
    api.post<PoolPostRes>('/polls',{title})
    .then(res=>{
      console.log(res)
      resolve(res.data.poll)
    })
    .catch((err) => reject(err))
  })
}