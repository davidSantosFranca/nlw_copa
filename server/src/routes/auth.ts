import { FastifyInstance } from "fastify"
import { z } from "zod"
import { getGoogleUserInfo } from "../services/api"
import { authentication } from "../services/authenticate"
import { prisma } from "../services/prisma"

export async function authRoutes(fastify:FastifyInstance){
  fastify.post('/auth', async (req, rep) => {
    try {
      const createUserBody = z.object({
        access_token: z.string()
      })
      const {access_token} = createUserBody.parse(req.body);

      const userInfo = await getGoogleUserInfo(access_token);
      
      let user = await prisma.user.upsert({
        where:{googleId: userInfo.id},
        update:{
          name: userInfo.name,
          email: userInfo.email,
          avatarUrl: userInfo.picture
        },
        create:{
          name: userInfo.name,
          email: userInfo.email,
          googleId: userInfo.id,
          avatarUrl: userInfo.picture
        },
      })
      
      const token = fastify.jwt.sign({
        name:userInfo.name,
        avatarUrl:userInfo.picture,
      },{
        sub: user.id,
        expiresIn:'7 days',
      })

      rep.status(201);
      rep.send({token});
      return rep;
    } catch (error) {
      
      return rep.status(500).send({error})
    }
  })
  fastify.get(
    '/auth/me',
    {onRequest:[authentication]},
    async(req)=>{
    return {user: req.user}
  })
}