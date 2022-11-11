import { FastifyRequest } from "fastify";
;
export async function authentication(req:FastifyRequest){
  try {
    await req.jwtVerify();
  } catch (error) {
    console.log(error);
    return false
  }
}