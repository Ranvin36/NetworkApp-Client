import { ColorPalatte } from "@/constants/Colors"
import { ipAddress } from "@/constants/ipAddress"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { StyleSheet, View,Text, FlatList,Image} from "react-native"
import { useSelector } from "react-redux"
import { rootStore } from "./redux/store"
import Ionicons from '@expo/vector-icons/Ionicons';
import BackArrow from "@/components/backArrow"
import BlockedUser from "@/components/blockedUser"
const Colors = ColorPalatte()
const Block:React.FC = () =>{
    const user = useSelector((state:rootStore) => state.user.user)
    const [blockedUsers, setBlockedUsers] = useState([])
    async function GetBlockedUser(){
        const response = await axios.get(`http://${ipAddress}:3001/users/block`,{
            headers:{
                Authorization : `Bearer ${user?.token}`
            }
        })

        setBlockedUsers(response.data.findBlocked.blocked)
    }

    async function UnBlockUser(uid:number){
        console.log(uid)
        const response = await axios.post(`http://${ipAddress}:3001/users/unblock/${uid}`,null,{
            headers:{
                Authorization : `Bearer ${user?.token}`
            }
        })
        console.log(response.data)
    }

    useEffect(() =>{
        GetBlockedUser()
    },[])

    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <BackArrow/>
                <Text style={{fontFamily:"Poppins-Bold",fontSize:25,color:Colors.theme.fontColor,marginLeft:10}}>Blocked</Text>
            </View>
            <View style={styles.blockedUsers}>
                <FlatList data={blockedUsers} renderItem={({item}) =>{
                    return(
                       <BlockedUser item={item} UnBlockUser={UnBlockUser}/>
                    )
                }}/>
            </View>

        </View>
    )
}

export default Block

const styles = StyleSheet.create({
    container:{
        backgroundColor:Colors.theme.backgroundColor,
        paddingHorizontal:20,
        height:"100%"
    },
    header:{
        paddingTop:40,
        flexDirection:"row",
        alignItems:"center"
    },
    blockedUser:{
        flexDirection:'row',
        alignItems:'center',
        marginVertical:10
    },
    profilePicture:{
        width:50,
        height:50,
        borderRadius:50,
    },
    blockedUsers:{

    },
    text:{
        fontFamily:"Poppins-Light"
    },
    blockedUserLayout:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between"
    }
})