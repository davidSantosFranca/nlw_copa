import { FastifyInstance } from "fastify"
import { prisma } from "../services/prisma"

export  async function userRoutes(fastify:FastifyInstance){
  fastify.get('/users/count', async ()=>{
    return {count: await prisma.user.count()}
  })
}