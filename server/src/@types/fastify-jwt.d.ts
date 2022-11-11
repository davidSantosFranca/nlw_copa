import '@fastify/jwt'
import { string } from 'zod'

declare module '@fastify/jwt'{
  interface FastifyJWT{
    user:{
      sub:string;
      name:string;
      avatarUrl:string;
  }
  }
}