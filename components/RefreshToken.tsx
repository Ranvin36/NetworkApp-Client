import { setUser } from "@/app/redux/userSlice"
import { ipAddress } from "@/constants/ipAddress"
import axios from "axios"
import { useDispatch} from "react-redux"


async function RefreshToken(refreshToken:string){
    const response = await axios.post(`http://${ipAddress}:3001/users/refresh-token`,{refreshToken})
    return response.data
}

export default RefreshToken