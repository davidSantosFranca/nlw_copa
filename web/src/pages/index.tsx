import { GetStaticProps, InferGetStaticPropsType } from 'next'
import Image from 'next/image'
import appPreviewImage from '../assets/app-nlw-copa-preview.png'
import logoImage from '../assets/logo.svg'
import usersAvatarExampleImage from '../assets/users-avatar-example.png'
import iconCheck from '../assets/icon-check.svg'
import { guessesCount, poolPost, poolsCount, usersCount } from '../services/api'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/router'

interface HomeProps{
  poolsCount:number,
  usersCount:number,
  guessesCount:number,
}
export default function Home({poolsCount,usersCount,guessesCount}: InferGetStaticPropsType<typeof getStaticProps>){
  const router = useRouter();
  const [poolName, setPoolName] =useState("");
  
  return (
    <div className="max-w-[1124px] mx-auto overflow-clip mt-14 flex flex-row gap-28 justify-between">
      <main className="mx-10">
        <Image className='w-auto h-10' src={logoImage} alt={'logo NLW Copa'}/>
        <h1 className="mt-14 text-white text-5xl font-bold leading-tight" >Crie seu próprio bolão da copa e compartile entre amigos!</h1>
        <div className="mt-10 flex items-center gap-2 ">
          <Image className="w-auto h-16" src={usersAvatarExampleImage} alt={'Avatares de exeplos dos usuários no sistema'} />
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500 tx-">+{usersCount}</span> pessoas já estão usando
          </strong>
        </div>
        <form className="mt-10 flex gap-2" onSubmit={(e)=>handleSubmit(e)}>
          <input
            className="flex-1 text-gray-100 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm"
            type="text"
            value={poolName}
            onChange={(e)=>setPoolName(e.target.value)}
            required
            placeholder="Qual nome do seu bolão"
          />
          <button
            type="submit"
            className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700 hover:cursor-pointer"
          >Criar meu bolão</button> 
        </form>
        <p
          className="mt-4 text-sm text-gray-300 leading-relaxed"
        >Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀</p>
        <div className="mt-10 pt-10 border-t border-gray-600 divide-x divide-gray-600 grid grid-cols-2 text-gray-100">
          <div  className="flex justify-start gap-6">
            <Image className="h-16 w-auto" src={iconCheck} alt={'checkmark'}/>
            <div className="flex  items-center flex-col content-end">
              <span className="font-bold text-2xl">+{poolsCount}</span>
              <span>Bolões criados </span>
            </div>
          </div>
          <div className="flex justify-end gap-6">
            <Image className="h-16 w-auto" src={iconCheck} alt={'checkmark'}/>
            <div className="flex items-center flex-col content-end">
              <span className="font-bold text-2xl">+{guessesCount}</span>
              <span>Palpites feitos </span>
            </div>
          </div>
        </div>
      </main>
      <div className='w-full flex items-center'>
        <Image
          className='flex-1 w-full h-auto' 
          priority
          src={appPreviewImage}
          quality={100}
          alt="Dois celulares com o preview do aplicativo NLW Copa mobile" />
      </div>
    </div>
  )

  function handleSubmit(e: FormEvent<HTMLFormElement>){
    e.preventDefault();
    poolPost({title:poolName}).then(async res=>{
      console.log(res);
      setPoolName('');
      await navigator.clipboard.writeText(res);
      // refreshServerSideProps();
      alert(`Bolão "${poolName}" criado com sucesso. Código ${res} copiado!`);
    })
    .catch(err=>{
      alert(`Falha ao criar o bolão ${poolName}`)
      console.error(err)}
      );
  }
  function refreshServerSideProps(){
    router.replace(router.asPath);
  }
}

export const getStaticProps:GetStaticProps<HomeProps> =  async() =>
{
  const [ poolsCountRes,
          usersCountRes,
          guessesCountRes,] = await Promise.all([
    poolsCount(),
    usersCount(),
    guessesCount(),
  ]).catch(error=>{
    console.error(error);
    return [0,0,0]
  })

  return {
    props:{
      poolsCount:  poolsCountRes,
      usersCount:  usersCountRes,
      guessesCount:guessesCountRes
    } ,
    revalidate:600
  }
}