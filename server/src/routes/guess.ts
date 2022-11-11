import { FastifyInstance } from "fastify"
import { z } from "zod";
import { authentication } from "../services/authenticate";
import { prisma } from "../services/prisma"

export  async function guessRoutes(fastify:FastifyInstance){
  fastify.get('/guesses/count', async ()=>{
    return {count: await prisma.guess.count()}
  });

  fastify.post('/poll/:pollId/games/:gameId/guess',{
    onRequest:[authentication]
  }, async(req, rep) => {
    const createPollGameParams = z.object({
      pollId: z.string(),
      gameId: z.string(),
    });
    const {pollId, gameId} = createPollGameParams.parse(req.params);
    
    const postPollGameBody = z.object({
      firstTeamPoints: z.number(),
      secondTeamPoints: z.number(),
    });
    const {secondTeamPoints, firstTeamPoints} = postPollGameBody.parse(req.body);

    const participant = await prisma.participant.findUniqueOrThrow({
      where:{
        userId_pollId:{
          pollId,
          userId: req.user.sub
        }
      }
    });
    
    if(!participant) {
      return rep.status(400).send({message:"You're not in this poll"});
    }
    const guess = await prisma.guess.findUnique({
      where:{
        participantId_gameId:{
          gameId,
          participantId: participant.id
        }
      }
    });

    if(guess){
      return rep.status(400).send({message: "You already made a guess to this game and poll"})
    }
    
    const game = await prisma.game.findUniqueOrThrow({
      where:{ id:gameId}
    });
    await prisma.poll.findUniqueOrThrow({
      where:{id:pollId}
    })

    if(game.date<new Date()){
      return rep.send(400).send({message:"This game already happenned or is currently in progress!"})
    }

    const guessCreated = await prisma.guess.create({
      data:{
        gameId, 
        participantId:participant.id, 
        firstTeamPoints: firstTeamPoints,
        secondTeamPoints: secondTeamPoints,
      }
    })
    
    return rep.status(201).send({guessDateCreation: guessCreated.createdAt})
  })
}