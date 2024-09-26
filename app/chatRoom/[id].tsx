import { StyleSheet, View ,Text, Image, TextInput, Dimensions, FlatList, TouchableOpacity,ActivityIndicator, ToastAndroid } from "react-native"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { useSelector } from "react-redux";
import { rootStore } from "../redux/store";
import { useEffect, useState } from "react";
import { ipAddress } from "@/constants/ipAddress";
import  {io, Socket} from "socket.io-client"
import SelectedOptions from "@/components/SelectedOptions";
import moment from "moment"
import Modal from "@/components/Modal";
import {Entypo,MaterialCommunityIcons,AntDesign} from '@expo/vector-icons';
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated,{ useAnimatedStyle, useSharedValue, withDelay, withSpring,useDerivedValue,runOnJS, measure } from "react-native-reanimated";
import { ColorPalatte } from "@/constants/Colors";
import { BlockUser } from "@/components/CallBacks/CallBackFunctions";
const Colors = ColorPalatte()

function ChatRoom(){
    const socket = io(`http://${ipAddress}:3001`)
    const {id} = useLocalSearchParams()
    const user = useSelector((state:rootStore) => state.user.user)
    const [chatUser, setChatUser] = useState([])
    const [messages, setMessage] = useState([])
    const [textInput,setTextInput] = useState("")
    const [selectedChats,setSelectedChat] = useState([])
    const [sendingMessage, setSendingMessage] = useState(false)
    const [popupOpened,setPopupOpened] = useState(false)
    const [sheetOpened,setSheetOpened] = useState(false)
    const [loading,setLoading] = useState(false)
    const SCREEN_HEIGHT = Dimensions.get('window').height
    const translateY = useSharedValue(SCREEN_HEIGHT)
    const context = useSharedValue(0)
    const messageIds = messages && messages.filter((message) => message.senderId[0] == id).map((messageId) => messageId._id)
    const unAuthorizedSelection = selectedChats && selectedChats.filter((chats) => {
        return messageIds.includes(chats.toString())
    })

    const SheetGesture = Gesture.Pan().onStart((event) =>{
        context.value = event.translationY
    }).onUpdate((event) =>{
        translateY.value = event.translationY + context.value
        translateY.value = Math.max(translateY.value , -SCREEN_HEIGHT/20)  
    }).onEnd((event) =>{
        if(translateY.value < SCREEN_HEIGHT/8){
            translateY.value = withSpring(0, {damping:50})
        }
        else{
            runOnJS(CloseBottomSheet)()
        }
    })

    const sheetStyle = useAnimatedStyle(() =>{
        return{
            transform:[{translateY:translateY.value}]
        }
    })

    async function GetUser(){
        const response = await axios.get(`http://${ipAddress}:3001/users/get-user/${id}`,{
            headers:{
                Authorization: `Bearer ${user?.token}`
            }
        })
        setChatUser(response.data.data)
    } 

    async function GetMessage(){
        const response = await axios.get(`http://${ipAddress}:3001/chats/${id}` ,{
            headers:{
                Authorization: `Bearer ${user?.token}`
            }
        })

        setMessage(response.data.findMessages)

    }

    async function SendMessage(){
        const data = {"message" : textInput , "opponentId" :id , "userAuth" :{"_id" : user?.data._id , "username":user?.data.username,"profilePicture":user?.data.profilePicture}}
        // const response = await axios.post(`http://${ipAddress}:3001/chats/create-chat/${id}` , data , {
            //     headers:{
                //         Authorization: `Bearer ${user.token}`
                //     }
                // })
                // console.log(response.data)
        socket.emit("chatMessage",data)
        setTextInput("")
        setSendingMessage(true)

    }

    async function DeleteChat(){
        try{
            setLoading(true)
            const data ={"id" : selectedChats}
            const response = await axios.post(`http://${ipAddress}:3001/chats/delete-message`,data,{
                headers:{
                    Authorization:`Bearer ${user?.token}`
                }
            })
            if(response.status === 204){
                selectedChats.forEach((chat) =>{
                    setMessage((prev) => prev.filter((msg) => msg._id != chat))
                })
            }
        }
        catch(error){
            console.log(error)
        }
        setLoading(false)
        setSelectedChat([])
        setPopupOpened((prev) => !prev)
    }

    function PopUpController(){
        setPopupOpened((prev) => !prev)
    }

    async function BlockController(){
        try{
            const response = await BlockUser(id,user?.token)
            ToastAndroid.show("User Blocked Sucessfully", ToastAndroid.SHORT)
            router.push('/home')
        }
        catch(error){
            console.error(error)
        }
    }


    useEffect(() => {
        GetUser()
    },[])
    useEffect(() => {
        GetMessage()
    },[])

    useEffect(() => {
        socket.on("messages" , (data) =>{
            setMessage(data)
        })

        return()=>{
            socket.off("messages")
        }
    },[socket])

    useEffect(() => {
        socket.on("fetchMessages" , (data) =>{
            setMessage((prev) => [...prev,data.findMessages])
        })
    },[socket])

    useEffect(() =>{
        socket.on("receiveMessasge" ,  (data) =>{
            setMessage((prev) => [...prev,data])
            setSendingMessage(false)
        })
        return ()=>{
            socket.disconnect()
        }
    },[])

    function CloseBottomSheet(){
        setSheetOpened(false)
        translateY.value = withSpring(SCREEN_HEIGHT, {damping:50})
    }

    function OpenBottomSheet(){
        setSheetOpened(true)
        translateY.value = withSpring(0, {damping:50})
    }


    return(
        <View style={styles.container}>
            <Modal popupOpened={popupOpened} PopUpController={PopUpController} DeleteChat={DeleteChat} loading={loading}>
                Are You Sure You Want to Delete These Messages?
            </Modal>

            {!selectedChats.length>0 ?
            <View style={styles.header}>
                <View style={{flexDirection:"row",alignItems:"center"}}>
                    <TouchableOpacity style={{marginRight:5}} onPress={() => router.back()}>
                        <MaterialIcons name="keyboard-arrow-left" size={27} color={Colors.theme.fontColor} />        
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
                                <Text style={[styles.textColor,{fontFamily:"Poppins-Bold",fontSize:14}]}>{chatUser.username}</Text>
                                <Text style={[styles.textColor,{fontFamily:"Poppins-Light", fontSize:12,marginTop:-5}]}>Online</Text>
                            </View>
                    </View>
                </View>
                <TouchableOpacity style={[styles.selectOption]} onPress={OpenBottomSheet}>
                    <Entypo name="dots-two-vertical" size={24} color={Colors.theme.fontColor} />
                </TouchableOpacity>
            </View>
            :
           <View style={styles.selected}>
                <SelectedOptions selectedChats={selectedChats} unAuthorizedSelection={unAuthorizedSelection} setSelectedChat={setSelectedChat} DeleteChat={PopUpController}/>
           </View>
            }
           <View style={styles.messageArea}>
            <FlatList data={messages} renderItem={({item}) =>{
                const formattedUpdatedAt = moment(item.updatedAt).format('h:mm a');
                const isSelected = selectedChats.filter((selected) => selected == item?._id)     
                return(
                <TouchableOpacity style={{backgroundColor:isSelected.length>0?Colors.theme.backgroundTransparent:null}} onLongPress={() => setSelectedChat((prev) => [...prev,item._id])} onPress={selectedChats.length>0 ? isSelected.length>0? ()=> setSelectedChat((prev) => prev.filter((chatId) => chatId.toString() != item._id.toString())) : () => setSelectedChat((prev) => [...prev,item._id]) : null}>
                    <View style={[styles.messageBackground,{alignItems: item.senderId == user.data._id ? "flex-end" : "flex-start"}]}>
                        <View style={[styles.message , {backgroundColor:item.senderId  == user.data._id ?  Colors.light.text  : Colors.theme.primaryMix}]}>
                            <Text style={[styles.messageText , {color:item.senderId ==   user.data._id ? "#fff" :"#000"}]}>{item.message}</Text>
                        </View>
                        <View>
                            <Text style={[styles.textColor,styles.messageText]}>{`${formattedUpdatedAt}`}</Text>
                            
                        </View> 
                    </View>
                </TouchableOpacity>
                )
            }}/>
           </View>
                <View style={{backgroundColor:Colors.theme.backgroundTransparent,width:"90%",height:55,padding:10,borderRadius:10,position:"absolute",bottom:30,flexDirection:"row",justifyContent:"space-between",alignItems:"center",alignSelf:"center"}}>
                    <View style={{padding:5,borderRadius:5,width:"90%"}}>
                        <TextInput value={textInput} placeholder="Message Here" placeholderTextColor={Colors.theme.fontColor} style={{fontFamily:"Poppins-Light",color:Colors.theme.fontColor}} onChangeText={(e) => setTextInput(e)} />
                    </View>
                    <TouchableOpacity style={{backgroundColor:Colors.light.text,borderRadius:50,width:35,height:35,justifyContent:"center",alignItems:"center"}} onPress={SendMessage}>
                        {!sendingMessage ?
                            <MaterialCommunityIcons name="send" size={24} color="#fff" /> 
                        :
                            <ActivityIndicator color="#fff"/>
                    }
                    </TouchableOpacity>
                </View>
                <GestureDetector gesture={SheetGesture}>
                    <Animated.View style={[sheetStyle,{position:"absolute",backgroundColor:Colors.theme.commentsBg,zIndex:2,borderRadius:10,width:"90%",bottom:10,alignSelf:"center"}]}>
                        <View style={{width:15,borderRadius:50,height:3,backgroundColor:"#ccc",alignSelf:"center",marginTop:10}}></View>
                        <View style={{paddingHorizontal:20,paddingVertical:15}}>
                            <View style={{marginVertical:10,flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
                                <Text style={{fontFamily:"Poppins-Bold",fontSize:20,color:Colors.theme.fontColor}}>{chatUser.username}</Text>
                                <TouchableOpacity onPress={CloseBottomSheet}>
                                    <AntDesign name="closecircleo" size={20} color={Colors.theme.fontColor} />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style={styles.sheetOption} onPress={() => router.push({pathname:`/viewProfile/${id}`,params:{id}})}>
                                <Text style={styles.bottomSheetText}>View Profile</Text>
                                <MaterialCommunityIcons name="face-man-outline" size={20} color={Colors.theme.fontColor} style={{marginBottom:3}}  />

                            </TouchableOpacity>
                            <TouchableOpacity style={styles.sheetOption} onPress={BlockController}>
                                <Text style={styles.bottomSheetText}>Block</Text>
                                <Entypo name="block" size={18} color={Colors.theme.fontColor} />
                            </TouchableOpacity>
                            <View style={styles.sheetOption}>
                                <Text style={styles.bottomSheetText}>Archive</Text>
                                <Entypo name="archive" size={18} color={Colors.theme.fontColor} />
                            </View>
                            <View style={styles.sheetOption}>
                                <Text style={styles.bottomSheetText}>Report</Text>
                                <MaterialIcons name="report-gmailerrorred" size={20} color={Colors.theme.fontColor} />
                            </View>
                        </View>
                    </Animated.View>
                </GestureDetector>
                <TouchableOpacity style={{backgroundColor:"#000",display:sheetOpened ? "flex" : "none",position:"absolute",left:0,top:0,height:"100%",width:"100%",zIndex:1,opacity:0.3}} onPress={CloseBottomSheet}>

                </TouchableOpacity>
           </View>
    )
}


const styles = StyleSheet.create({
    container:{
        height:"100%",
        backgroundColor:Colors.theme.backgroundColor
    },
    header:{
        paddingHorizontal:15,
        paddingTop:45,
        paddingVertical:20,
        backgroundColor:Colors.theme.backgroundTransparent,
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between"
    },
    selected:{
        paddingTop:45,
        paddingVertical:20,
        backgroundColor:Colors.theme.backgroundTransparent,

    },
    details:{
        flexDirection:"row",
        alignItems:"center"
    },
    messageArea:{
        width:"100%",
        justifyContent:"space-between",
        paddingVertical:10,
        marginBottom:30
    },
    message:{
        backgroundColor:Colors.light.text,
        borderRadius:30,
        paddingHorizontal:20,
        paddingVertical:10,
        maxWidth:250,
        elevation:2,shadowColor:"#000",  shadowOffset: {width: -10, height: 3},shadowOpacity: 0.2,shadowRadius: 50,
    },
    messageText:{
        fontFamily:"Poppins-Light",
        fontSize:13
    },
    messageBackground:{
        marginVertical:5,
        marginHorizontal:20,
    },
    selectOption:{
        backgroundColor:Colors.theme.commentsBg,
        padding:5,
        borderRadius:10
    },
    bottomSheetText:{
        fontFamily:"Poppins-Light",
        color:Colors.theme.fontColor
    },
    sheetOption:{
        marginVertical:2,
        flexDirection:"row",
        justifyContent:"space-between"
    },
    textColor:{
        color:Colors.theme.fontColor
    }
})


export default ChatRoom