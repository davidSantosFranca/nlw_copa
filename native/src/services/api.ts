import axios, { AxiosResponse } from 'axios';
import { GameProps } from '../components/Game';

const api = axios.create({
  baseURL: 'http://192.168.0.4:3333'
})

export function updateAuthToken(token: string):void{
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export function signInWithBackEnd(access_token:string):Promise<AxiosResponse>{
  return new Promise(async (resolve, reject) =>{
    await api.post('/auth', {access_token}).then((response) =>
    resolve(response)).catch((error) =>reject(error))
  })
}

export function getCurrentUserData():Promise<AxiosResponse>{
  return new Promise(async (resolve, reject) =>{
    await api.get('/auth/me').then((response) =>
    resolve(response)).catch((error) =>reject(error))
  })
}

export function createPoll(title:string):Promise<AxiosResponse>{
  return new Promise(async (resolve, reject) =>{
    await api.post('/polls', {title}).then((response) =>
    resolve(response)).catch((error) =>reject(error))
  })
}

export function getPollById(id:string):Promise<AxiosResponse>{
  return new Promise(async (resolve, reject) =>{
    await api.get(`/polls/${id}`).then((response) =>
    resolve(response)).catch((error) =>reject(error))
  })
}

export function joinPollByCode(pollCode:string):Promise<AxiosResponse>{
  return new Promise(async (resolve, reject) =>{
    await api.post(`/polls/join`, {code:pollCode}).then((response) =>
    resolve(response)).catch((error) =>reject(error))
  })
}

export function getParticipatingPolls():Promise<AxiosResponse>{
  return new Promise(async (resolve, reject) =>{
    await api.get('/polls/me/participating').then((response) =>
    resolve(response)).catch((error) =>reject(error))
  })
}


export function getPollGames(id:string):Promise<AxiosResponse>{
  return new Promise(async (resolve, reject) =>{
    await api.get(`/polls/${id}/games`).then((response) =>
    resolve(response)).catch((error) =>reject(error))
  })
}


export function makeGuess(pollId:string,gameId,firstTeamPoints:number,secondTeamPoints:number):Promise<AxiosResponse>{
  return new Promise(async (resolve, reject) =>{
    await api.post(`/poll/${pollId}/games/${gameId}/guess`, {
      firstTeamPoints,
      secondTeamPoints
    }).then((response) =>
    resolve(response)).catch((error) =>reject(error))
  })
}