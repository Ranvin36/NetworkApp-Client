import ChatLayoutComponent from "@/components/chatLayoutComponent"
import Stories from "@/dummyData/stories"
import { SafeAreaView, View ,Text, StyleSheet,Image,TextInput, FlatList, Dimensions } from "react-native"
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { useSelector } from "react-redux";
import { rootStore } from "./redux/store";
import axios from "axios";
import { ipAddress } from "@/constants/ipAddress";
import { useEffect, useState } from "react";
import {io} from"socket.io-client"
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics"
import { router } from "expo-router";
import {AntDesign,Entypo,Feather} from '@expo/vector-icons';
import SelectedOptions from "@/components/SelectedOptions";
import { ColorPalatte } from "@/constants/Colors";
import moment from "moment";
const Colors = ColorPalatte()

function Chats(){
    const socket = io(`http://${ipAddress}:3001`)
    const user = useSelector((state:rootStore) => state.user.user)
    const [chatData,setChatData] = useState([])
    const [searchText, setSearchText] = useState("")
    const [selectedChats , setSelectedChat] = useState([])
    function FilterSearch() {
        const searchFilter = chatData.filter((item) => 
            item.receiverData[0].username.toLowerCase().includes(searchText.toLowerCase(),
    )
        );
    
        setChatData(searchFilter);
    }
    
    async function GetChats(){
        const response = await axios.get(`http://${ipAddress}:3001/chats/` ,{
            headers:{
                Authorization : `Bearer ${user.token}`
            }
        })
        setChatData(response.data.findChats)
    }



    async function selectChat(id:number){
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        setSelectedChat((prev):any => [...prev,id])
    }

    async function DeleteChat(){
        const data  ={id:selectedChats[0]}
        const response = await axios.post(`http://${ipAddress}:3001/chats/delete/`,data ,{
            headers:{
                Authorization : `Bearer ${user?.token}`
            }
        })

        console.log(response.data)
    }
    


    useEffect(() => {
        GetChats()
    },[])

    useEffect(() =>{
        FilterSearch()
    },[searchText])

    return(
        <View style={styles.container}>
            {chatData &&  chatData.creatorData && chatData.creatorData.length>0 && <Text>{chatData.creatorData[0].username}</Text>}
            {selectedChats.length>0 ?
            <>         

                <View style={{marginBottom:1}}>
                    <SelectedOptions setSelectedChat={setSelectedChat} selectedChats={selectedChats} DeleteChat={DeleteChat}/>
                </View>
                <View style={{backgroundColor:"#ccc",width:"100%",height:1}}></View>
            </>
                :
            <View style={{marginHorizontal:20}}>
                <Text style={[styles.textColor,{fontFamily:"Poppins-Bold",fontSize:25}]}>Chats</Text>
            </View>
            }
            <View style={styles.searchContainer}>
                <View style={{marginRight:3,marginTop:7}}>
                    <EvilIcons name="search" size={24} color={Colors.theme.fontColor} />
                </View>
                <TextInput placeholder="Search Friends" placeholderTextColor={Colors.theme.fontColor} style={[styles.textColor,{fontFamily:"Poppins-Light",width:"90%"}]} onChangeText={(e)=>setSearchText(e)}/>
            </View>
            <View style={{marginTop:5,paddingHorizontal:20}}>
                {chatData.length>0 ?
                        <FlatList data={chatData} renderItem={({item}) =>{
                                if(item && item.creatorData && item.creatorData.length>0){
                                        const creatorId = item.creatorData[0].userId[0].toString()
                                        const userId = user.data._id
                                        const isSeleceted = selectedChats.filter((chatId) => chatId == item._id )
                                        const formattedUpdateAt = moment(item.updatedAt).format("ddd  hh:mm a ")
                                        if(creatorId == userId){
                                            const receiverId  = item.receiverData[0].userId
                                            return(
                                                <TouchableOpacity style={[isSeleceted.length>0 ? styles.chatContainer : null,{marginVertical:5,marginHorizontal:10}]} onLongPress={() =>selectChat(item._id)} onPress={() => router.push({pathname:`chatRoom/${receiverId}` , params:{id:receiverId}})}>
                                                    <ChatLayoutComponent item={item.receiverData} lastMessage={item.lastMessage} formattedUpdateAt={formattedUpdateAt}/>
                                                </TouchableOpacity>
                                            )
                                        }                                        
                                        else{
                                            const creatorId  = item.creatorData[0].userId
                                            return(
                                                <TouchableOpacity onLongPress={() => selectChat(item._id)} onPress={() => router.push({pathname:`chatRoom/${creatorId}` , params:{id:creatorId}})}>
                                                    <ChatLayoutComponent item={item.creatorData} lastMessage={item.lastMessage} formattedUpdateAt={formattedUpdateAt}/>
                                                </TouchableOpacity>
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
        // paddingHorizontal:20,
        paddingVertical:45,
        backgroundColor:Colors.theme.backgroundColor,
        height:"100%",width:Dimensions.get('window').width
    },
    chatsLayout:{
        marginVertical:5,
        flexDirection:"row",
        alignItems:"center"
    },
    chatContainer:{
        backgroundColor:Colors.theme.backgroundTransparent,
        marginHorizontal:10,
        paddingHorizontal:10,
        borderRadius:10,
        paddingVertical:10
    },
    searchContainer:{
        backgroundColor:Colors.theme.backgroundTransparent,
        paddingHorizontal:13,
        marginHorizontal:15,
        paddingVertical:8,
        borderRadius:10
        ,marginVertical:5,
        height:55,
        flexDirection:"row"},
    selectedIcons:{
        marginLeft:10
    },
    textColor:{
        color:Colors.theme.fontColor
    }
})