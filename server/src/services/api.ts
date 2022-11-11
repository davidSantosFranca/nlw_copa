import axios from "axios"
import { z } from "zod";

const userInfoSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string(),
    picture: z.string().url()
})
type UserInfoType = z.infer<typeof userInfoSchema>;
export function getGoogleUserInfo(token: string):Promise<UserInfoType> {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  return new Promise<UserInfoType>((resolve, reject) => {
    try {
          axios.get<UserInfoType>('https://www.googleapis.com/oauth2/v2/userinfo', config)
        .then((response) => {
          resolve(userInfoSchema.parse(response.data));
        })
        .catch((err) => reject(err))
    } catch (error) {
      reject(error);
    }
  })
}