import { StyleSheet, View ,Text, Image, TextInput, Dimensions, FlatList, TouchableOpacity,ActivityIndicator } from "react-native"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from "@/constants/Colors";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { useSelector } from "react-redux";
import { rootStore } from "../redux/store";
import { useEffect, useState } from "react";
import { ipAddress } from "@/constants/ipAddress";
import  {io, Socket} from "socket.io-client"
import SelectedOptions from "@/components/SelectedOptions";
import moment from "moment"
function ChatRoom(){
    const socket = io(`http://${ipAddress}:3001`)
    const {id} = useLocalSearchParams()
    const user = useSelector((state:rootStore) => state.user.user)
    const [chatUser, setChatUser] = useState([])
    const [messages, setMessage] = useState([])
    const [textInput,setTextInput] = useState("")
    const [selectedChats,setSelectedChat] = useState([])
    const [sendingMessage, setSendingMessage] = useState(false)
    async function GetUser(){
        const response = await axios.get(`http://${ipAddress}:3001/users/get-user/${id}`,{
            headers:{
                Authorization: `Bearer ${user.token}`
            }
        })
        setChatUser(response.data.data)
    } 

    async function GetMessage(){
        const response = await axios.get(`http://${ipAddress}:3001/chats/${id}` ,{
            headers:{
                Authorization: `Bearer ${user.token}`
            }
        })

        console.log(response.data)
        setMessage(response.data.findMessages)

    }

    async function SendMessage(){
        const data = {"message" : textInput , "opponentId" :id , "userAuth" :{"_id" : user.data._id , "username":user.data.username,"profilePicture":user.data.profilePicture}}
        // const response = await axios.post(`http://${ipAddress}:3001/chats/create-chat/${id}` , data , {
        //     headers:{
        //         Authorization: `Bearer ${user.token}`
        //     }
        // })
        // console.log(response.data)
        socket.emit("chatMessage",data)
        setSendingMessage(true)

    }

    async function DeleteChat(){
        const data ={"id" : selectedChats[0]}
        const response = await axios.post(`http://${ipAddress}:3001/chats/delete-message`,data,{
            headers:{
                Authorization:`Bearer ${user.token}`
            }
        })
        console.log(response.data)
    }


    useEffect(() => {
        GetUser()
    },[])
    useEffect(() => {
        GetMessage()
    },[])

    useEffect(() => {
        socket.on("messages" , (data) =>{
            console.log("data",data)
            setMessage(data)
        })

        return()=>{
            socket.off("messages")
        }
    },[socket])

    useEffect(() => {
        socket.on("fetchMessages" , (data) =>{
            console.log(data ,  "data")
            setMessage((prev) => [...prev,data.findMessages])
        })
    },[socket])

    useEffect(() =>{
        socket.on("receiveMessasge" ,  (data) =>{
            console.log(data ,  "FETCHED")
            setMessage((prev) => [...prev,data])
            setSendingMessage(false)
        })
        return ()=>{
            socket.disconnect()
        }
    },[])

    console.log(selectedChats)

    return(
        <View style={styles.container}>
            {!selectedChats.length>0 ?
            <View style={styles.header}>
                <TouchableOpacity style={{marginRight:5}} onPress={() => router.back()}>
                    <MaterialIcons name="keyboard-arrow-left" size={27} color="black" />        
                </TouchableOpacity>
                <View style={styles.details}>
                    {!chatUser.profilePicture ?                
                        <View>
                            <Image source={require("../../assets/images/user.jpg")} style={{width:50,height:50,borderRadius:50}}/>
                        </View>
                                :
                        <View>
                            <Image source={{uri:chatUser.profilePicture}} style={{width:50,height:50,borderRadius:50}}/>
                        </View>
                }
                        <View style={{marginLeft:10}}>
                            <Text style={{fontFamily:"Poppins-Bold",fontSize:14}}>{chatUser.username}</Text>
                            <Text style={{fontFamily:"Poppins-Light", fontSize:12,marginTop:-5}}>Online</Text>
                        </View>
                </View>
            </View>
            :
           <View style={styles.selected}>
                <SelectedOptions selectedChats={selectedChats} setSelectedChat={setSelectedChat} DeleteChat={DeleteChat}/>
           </View>
            }
           <View style={styles.messageArea}>
            <FlatList data={messages} renderItem={({item}) =>{
                const formattedUpdatedAt = moment(item.updatedAt).format('h:mm a');
                const isSelected = selectedChats.filter((selected) => selected == item._id)     
                return(
                <TouchableOpacity style={{backgroundColor:isSelected.length>0?"#ccc":null}} onLongPress={() => setSelectedChat((prev) => [...prev,item._id])}>
                    <View style={[styles.messageBackground,{alignItems: item.senderId == user.data._id ? "flex-end" : "flex-start"}]}>
                        <View style={[styles.message , {backgroundColor:item.senderId  == user.data._id ?  Colors.light.text  : "#fff"}]}>
                            <Text style={[styles.messageText , {color:item.senderId ==   user.data._id ? "#fff" :"#000"}]}>{item.message}</Text>
                        </View>
                        <View>
                            <Text style={styles.messageText}>{`${formattedUpdatedAt}`}</Text>
                            
                        </View> 
                    </View>
                </TouchableOpacity>
                )
            }}/>
           </View>
                <View style={{backgroundColor:"#fff",width:"90%",height:55,padding:10,borderRadius:10,position:"absolute",bottom:30,flexDirection:"row",justifyContent:"space-between",alignItems:"center",alignSelf:"center"}}>
                    <View style={{backgroundColor:"#fff",padding:5,borderRadius:5,width:"90%"}}>
                        <TextInput placeholder="Message Here" style={{fontFamily:"Poppins-Light"}} onChangeText={(e) => setTextInput(e)} />
                    </View>
                    <TouchableOpacity style={{backgroundColor:Colors.light.text,borderRadius:50,width:35,height:35,justifyContent:"center",alignItems:"center"}} onPress={SendMessage}>
                        {!sendingMessage ?
                            <MaterialCommunityIcons name="send" size={24} color="#fff" /> 
                        :
                            <ActivityIndicator color="#fff"/>
                    }
                    </TouchableOpacity>
                </View>
           </View>
    )
}


const styles = StyleSheet.create({
    container:{
        height:"100%",
    },
    header:{
        paddingHorizontal:15,
        paddingTop:45,
        paddingVertical:20,
        backgroundColor:"#fff",
        flexDirection:"row",
        alignItems:"center"
    },
    selected:{
        paddingTop:45,
        paddingVertical:20,
        backgroundColor:"#fff",

    },
    details:{
        flexDirection:"row",
        alignItems:"center"
    },
    messageArea:{
        width:"100%",
        justifyContent:"space-between",
        paddingVertical:10,
    },
    message:{
        backgroundColor:Colors.light.text,
        borderRadius:10,
        paddingHorizontal:20,
        paddingVertical:10,
        maxWidth:250
    },
    messageText:{
        fontFamily:"Poppins-Light",
        color:"#000",
        fontSize:13
    },
    messageBackground:{
        marginVertical:5,
        marginHorizontal:20,


    }
})


export default ChatRoom