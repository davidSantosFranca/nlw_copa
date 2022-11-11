import { FastifyInstance } from "fastify"
import { z } from "zod"
import { authentication } from "../services/authenticate"
import { prisma } from "../services/prisma"

export  async function gameRoutes(fastify:FastifyInstance){
  fastify.get('/polls/:id/games',{
    onRequest:[authentication],
  },
  async(req, rep)=>{
    const getPoolParams = z.object({
        id: z.string().trim().describe('Id do bolão')
      })
    
    const {id} = getPoolParams.parse(req.params);
    
    const games = await prisma.game.findMany({
      orderBy:{
        date:'desc'
      },
      include:{
        guesses:{
          where:{
            participant:{
              userId: req.user.sub,
              pollId: id
            },
          },
        }
      }
    });

    return rep.status(200).send({games: games.map(x=>({...x, guesses: undefined, guess: x.guesses[0]??null}))})
  })
}