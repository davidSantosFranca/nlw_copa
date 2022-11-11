import Fastify from 'fastify'
import jwt from '@fastify/jwt'
import cors from '@fastify/cors'
import { userRoutes } from './routes/user';
import { guessRoutes } from './routes/guess';
import { pollRoutes } from './routes/poll';
import { gameRoutes } from './routes/game';
import { authRoutes } from './routes/auth';


async function bootstrap(){
  const fastify = Fastify({
    logger:true,
  });

  await fastify.register(cors, {
    origin:true,
  });

  await fastify.register(jwt, {
    secret:'nlwcopa'
  })

  fastify.register(authRoutes)
  fastify.register(gameRoutes)
  fastify.register(guessRoutes)
  fastify.register(pollRoutes)
  fastify.register(userRoutes)
  
  await fastify.listen({
    port: 3333,
    host:'0.0.0.0'
  })
}

bootstrap();