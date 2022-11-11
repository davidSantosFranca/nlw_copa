import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


async function main(){
  const user = await prisma.user.create({
    data:{
      name:'John Doe',
      googleId: '123',
      email:'john@example.com',
      avatarUrl:'https://api.multiavatar.com/test.svg'
    }
  });

  const poll = await prisma.poll.create({
    data:{
      title: 'Example poll',
      code: 'BOL123',
      ownerId: user.id,

      participants:{
        create:{
          userId: user.id,
        }
      }
    }
  })

  await prisma.game.create({
    data:{
      date: '2022-11-14T18:00:00.000Z',
      firstTeamCountryCode: 'DE',
      secondTeamCountryCode: 'BR',
    }
  })

  await prisma.game.create({
    data:{
      date: '2022-11-14T12:00:00.000Z',
      firstTeamCountryCode: 'AR',
      secondTeamCountryCode: 'PE',

      guesses:{
        create:{
          firstTeamPoints:2,
          secondTeamPoints:1,
          participant:{
            connect:{
              userId_pollId:{
                userId: user.id,
                pollId: poll.id
              }
            }
          }
        }
      }
    }
  })
}

main()