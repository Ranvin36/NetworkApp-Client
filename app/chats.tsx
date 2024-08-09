import ChatLayoutComponent from "@/components/chatLayoutComponent"
import Stories from "@/dummyData/stories"
import { SafeAreaView, View ,Text, StyleSheet,Image,TextInput, FlatList } from "react-native"
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { useSelector } from "react-redux";
import { rootStore } from "./redux/store";
import axios from "axios";
import { ipAddress } from "@/constants/ipAddress";
import { useEffect, useState } from "react";

function Chats(){
    const user = useSelector((state:rootStore) => state.user.user)
    const [chatData,setChatData] = useState([])
    async function GetChats(){
        const response = await axios.get(`http://${ipAddress}:3001/chats/` ,{
            headers:{
                Authorization : `Bearer ${user.token}`
            }
        })
        setChatData(response.data.findChats)
    }

    useEffect(() => {
        GetChats()
    },[])
    return(
        <View style={styles.container}>
            {chatData &&  chatData.creatorData && chatData.creatorData.length>0 && <Text>{chatData.creatorData[0].username}</Text>}
            <View>
                <Text style={{fontFamily:"Poppins-Bold",fontSize:25}}>Chats</Text>
            </View>
            <View style={{backgroundColor:"#f2f2f2",paddingHorizontal:13,paddingVertical:8,borderRadius:10,marginVertical:5,height:45,flexDirection:"row"}}>
                <View style={{marginRight:3,marginTop:2}}>
                    <EvilIcons name="search" size={24} color="black" />
                </View>
                <TextInput placeholder="Search Friends" style={{fontFamily:"Poppins-Light",width:"90%"}}/>
            </View>
            <View style={{marginTop:5}}>
                {chatData.length>0 ?
                        <FlatList data={chatData} renderItem={({item}) =>{
                                if(item && item.creatorData && item.creatorData.length>0){
                                        const creatorId = item.creatorData[0].userId[0].toString()
                                        const userId = user.data._id
                                        if(creatorId == userId){
                                            return(
                                                <ChatLayoutComponent item={item.receiverData}/>
                                            )
                                        }                                        
                                        else{
                                            return(
                                            <ChatLayoutComponent item={item.creatorData}/>
                                            )
                                        }
                                    }   
                                return null                                 
                        }}/>
                        :
                        <View style={{justifyContent:"center",alignItems:"center",height:"30%"}}>
                            <Text style={{textAlign:"center",fontFamily:"Poppins-Light"}}>No Users To Chat</Text>
                        </View>
                }
            </View> 
            
        </View>
    )
}


export default Chats


const styles = StyleSheet.create({
    container:{
        paddingHorizontal:20,
        paddingVertical:40,
        backgroundColor:"#fff",
        height:"100%"
    },
    chatsLayout:{
        marginVertical:5,
        flexDirection:"row",
        alignItems:"center"
    }
})