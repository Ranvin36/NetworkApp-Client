import { StyleSheet, View ,Text, Image, TextInput, Dimensions, FlatList, TouchableOpacity } from "react-native"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from "@/constants/Colors";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { useSelector } from "react-redux";
import { rootStore } from "../redux/store";
import { useEffect, useState } from "react";
import { ipAddress } from "@/constants/ipAddress";
function ChatRoom(){
    const {id} = useLocalSearchParams()
    const user = useSelector((state:rootStore) => state.user.user)
    const [chatUser, setChatUser] = useState([])
    const [messages, setMessage] = useState([])
    const [textInput,setTextInput] = useState("")
    console.log(id ,"ID")
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
        const data = {"message" : textInput}
        const response = await axios.post(`http://${ipAddress}:3001/chats/create-chat/${id}` , data , {
            headers:{
                Authorization: `Bearer ${user.token}`
            }
        })
        console.log(response.data)
    }

    console.log(messages)

    useEffect(() => {
        GetUser()
    },[])
    useEffect(() => {
        GetMessage()
    },[])


    return(
        <View style={styles.container}>
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
           <View style={styles.messageArea}>
            <FlatList data={messages} renderItem={({item}) =>{
              
                const updatedAt = item.updatedAt;
                const updatedAtDate = new Date(updatedAt)

                const hours = updatedAtDate.getUTCHours()
                const minutes = updatedAtDate.getUTCMinutes()  
                const seconds = updatedAtDate.getUTCSeconds()  

                const currentDate = new Date()
                const updatedTimeDate = new Date(currentDate)
                updatedTimeDate.setUTCHours(hours,minutes,seconds,0)
                 const updatedTime = updatedTimeDate.toISOString();
                 console.log(`Updated Time: ${updatedTimeDate}`);
                 return(
                <View style={{marginVertical:5}}>
                    <View style={{alignItems: item.senderId == user.data._id ? "flex-end" : "flex-start"}}>
                        <View style={styles.message}>
                            <Text style={styles.messageText}>{item.message}</Text>
                        </View>
                        <View>
                            <Text style={styles.messageText}>{`${updatedTime}`}</Text>
                            
                        </View>
                    </View>
                </View>
                )
            }}/>
           </View>
                <View style={{backgroundColor:"#fff",width:"90%",height:55,padding:10,borderRadius:10,position:"absolute",bottom:30,flexDirection:"row",justifyContent:"space-between",alignItems:"center",alignSelf:"center"}}>
                    <View style={{backgroundColor:"#fff",padding:5,borderRadius:5,width:"90%"}}>
                        <TextInput placeholder="Message Here" style={{fontFamily:"Poppins-Light"}} onChangeText={(e) => setTextInput(e)} />
                    </View>
                    <TouchableOpacity style={{backgroundColor:Colors.light.text,borderRadius:50,width:35,height:35,justifyContent:"center",alignItems:"center"}} onPress={SendMessage}>
                        <MaterialCommunityIcons name="send" size={24} color="#fff" />
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
    details:{
        flexDirection:"row",
        alignItems:"center"
    },
    messageArea:{
        width:"100%",
        justifyContent:"space-between",
        padding:10
    },
    message:{
        backgroundColor:Colors.light.text,
        borderRadius:10,
        paddingHorizontal:15,
        paddingVertical:10
    },
    messageText:{
        fontFamily:"Poppins-Light",
        color:"#fff"
    }
})


export default ChatRoom