import { Share } from "react-native";

export async function handleShare(msg:string){
    await Share.share({
      message: msg
    })
  }