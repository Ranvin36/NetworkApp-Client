import axios from "axios"
import { ipAddress } from "@/constants/ipAddress"
import { useSelector } from "react-redux"
import { rootStore } from "@/app/redux/store"

// const user = useSelector((state:rootStore) => state.user.user)

export async function GetFollowers(user){
    // const response = await axios.get(`http://${ipAddress}:3001/users/get-followers/${user.data._id}`,{
    //     headers:{
    //         Authorization:`Bearer ${user.token}`
    //     }
    // })
    let response = await fetch(`http://${ipAddress}:3001/users/get-followers/${user.data._id}`,{
        headers:{
            Authorization : `Bearer  ${user.token}`
        }
    })
    let responseJson = await response.json()
    return responseJson
}