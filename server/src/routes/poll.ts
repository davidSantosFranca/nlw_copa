import { FastifyInstance } from "fastify"
import ShortUniqueId from "short-unique-id"
import { prisma } from "../services/prisma"
import z from 'zod'
import { authentication } from "../services/authenticate"

export  async function pollRoutes(fastify:FastifyInstance){
  fastify.get('/polls/count', async ()=>{
    return {count: await prisma.poll.count()}
  })

  fastify.post('/polls', async (request, reply)=>{
    try{
      const createpollBody = z.object({
        title: z.string().min(1),
      })
      const {title} = createpollBody.parse(request.body);
      const generate = new ShortUniqueId({length: 6, dictionary:'alphanum_upper'});
      let poll = null;
      const code =String(generate());
      try {
        // authentication(request);
        poll = await prisma.poll.create({
        data:{
          title,
          code:code,
          ownerId: request.user.sub,
          participants:{
            create:{
              userId: request.user.sub
            }
          }
        }
      })
      } catch (error) {
        poll = await prisma.poll.create({
        data:{
          title,
          code:code
        }})
      }

      return reply.status(201).send({poll:code})
    }
    catch(err){
      reply.status(400).send({err})
    }
  })

  fastify.post(
    '/polls/join',
    {onRequest:[authentication]},
    async (req, rep)=>{
      const joinPollBody= z.object({
        code:z.string().describe('Código recebido pelo criador do bolão').trim()
        .length(6, 'Código em formato inválido!')
        .transform(s=>s.toUpperCase())
      });

      const {code} = joinPollBody.parse(req.body);

      const poll = await prisma.poll.findFirstOrThrow({
        where:{
          code
        },
        include:{
          participants:{
            where:{
              userId: req.user.sub,
            }
          },
        }
      })

      const count = await prisma.participant.count({
        where:{
          pollId: poll.id
        }
      })
      if(poll.participants.length>0){
        return rep.status(200).send({count,poll, message:'You already are participating in this poll!'});
      }
      await prisma.participant.create({
        data:{
          pollId:poll.id,
          userId: req.user.sub
        }
      })

      if(!poll.ownerId){
        await prisma.poll.update({
          where:{
            id: poll.id
          },
          data:{
            ownerId: req.user.sub
          }
        })
      }

      return rep.status(201).send({poll, participantsCount: count})
  })

  fastify.get(
    '/polls/me/participating',
    {onRequest:[authentication]}
    ,async(req, rep)=>{
      const participatingPolls = await prisma.poll.findMany({
        where:{
          participants:{
            some:{
              userId: req.user.sub
            }
          }
        },
        include:{
          _count:{
            select:{
              participants:true
            }
          },
          owner: {
            select:{
              id:true, name: true 
            }
          },
          participants:{
            select:{
              user:{
                select:{
                  id:true,
                  avatarUrl:true
                }
              }
            },
            take:4
          }

        }
      })

      return rep.status(200).send({participatingPolls})
    }
  );

  fastify.get(
    '/polls/:id',
     {
      onRequest:[authentication]
    },async(req, rep)=>{
      const getPoolParams = z.object({
        id: z.string().trim().describe('Id do bolão')
      })
      const {id} = getPoolParams.parse(req.params);
      const poll = await prisma.poll.findUnique({
        where:{
          id
        },
        include:{
          _count:{
            select:{
              participants:true
            }
          },
          owner: {
            select:{
              id:true, name: true 
            }
          },
          participants:{
            select:{
              user:{
                select:{
                  id:true,
                  avatarUrl:true
                }
              }
            },
            take:4
          }

        }
      })

      return rep.status(200).send({poll})
    }
  );
  
  
  fastify.get(
    '/polls/code/:code',
     {
      onRequest:[authentication]
    },async(req, rep)=>{
      const getPoolParams = z.object({
        code: z.string().trim().describe('Id do bolão')
      })
      const {code} = getPoolParams.parse(req.params);
      const poll = await prisma.poll.findUnique({
        where:{
          code
        },
        include:{
          _count:{
            select:{
              participants:true
            }
          },
          owner: {
            select:{
              id:true, name: true 
            }
          },
          participants:{
            select:{
              user:{
                select:{
                  id:true,
                  avatarUrl:true
                }
              }
            },
            take:4
          }
        }
      })

      return rep.status(200).send({poll})
    }
  );
}