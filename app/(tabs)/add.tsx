import BackArrow from "@/components/backArrow"
import {View,Text, StyleSheet, TextInput, TouchableOpacity, Image,ScrollView, Pressable, Dimensions} from "react-native"
import * as ImagePicker from 'expo-image-picker'
import { useEffect, useState } from "react";
import axios from "axios";
import { ipAddress } from "@/constants/ipAddress";
import { useSelector } from "react-redux";
import { rootStore } from "../redux/store";
import { router } from "expo-router";
import { AntDesign,Ionicons,Feather,Entypo } from '@expo/vector-icons';
import { Colors } from "@/constants/Colors";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { CameraView } from "expo-camera";
import {actions, RichEditor, RichToolbar} from "react-native-pell-rich-editor";
import * as Haptics from "expo-haptics"
function Add(){
    const [image,setImage]  = useState([])
    const [text,setText] = useState('')
    const [description,setDescription] = useState('')
    const [selected,setSelected] = useState(0)
    const user = useSelector((state:rootStore) => state.user.user)
    const backgroundPosition = useSharedValue(15)
    const buttons = [{title:"Upload"},{title:"Camera"}]
    const [facing,setFacing] = useState('back')
    const selectImage = async () =>{
        const pickImage = await ImagePicker.launchImageLibraryAsync({
            mediaTypes:ImagePicker.MediaTypeOptions.All,
            allowsEditing:true,
            aspect:[4,3],
            quality:1
        })
        if(!pickImage.canceled){
            if(pickImage.assets[0].type == "image"){
                console.log("Image")
            }
            else{
                console.log("Video")
            }
            // console.log(pickImage.assets[0])
            const uri = pickImage.assets && pickImage.assets[0].uri
            if(!pickImage.canceled){
                setImage({
                    uri,
                     name: pickImage.assets[0].fileName || 'photo.jpg',
                     type: pickImage.assets[0].mimeType || 'image/jpeg'
                })
            }
        }
    }

    async function uploadPost(){
        console.log("UPLOAD")
        const data = new FormData()
        data.append('image',{
            uri: image.uri,
            name: image.name,
            type: image.type
        })
        data.append('text',text)
        data.append('description',description)
        console.log(data)
        const response = await axios.post(`http://${ipAddress}:3001/posts/create-post`,data,{
            headers:{
                'Content-Type': 'multipart/form-data',
                Authorization:`Bearer ${user.token}`
            }
        })
        router.push("/home")
    }

    const leftVal = useAnimatedStyle(()=>{
        return{
            left: backgroundPosition.value
        }
    })

    useEffect(()=>{
        backgroundPosition.value = withTiming(selected * (300 / buttons.length) + 15,{duration:300})
    },[selected])

    function rotateCamera(){
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        setFacing((current) => current == 'front' ? 'back' : 'front')
    }

    return(
        <ScrollView>
            {/* <View style={{backgroundColor:Colors.light.text,paddingVertical:20,borderRadius:10,width:300,position:"absolute",zIndex:1,marginVertical:55,
        marginHorizontal:25,alignItems:"center",left:Dimensions.get('window').width/20}}>
                <Animated.View style={[{backgroundColor:"#fff",position:"absolute",left:15,top:8,width:100,height:45, borderRadius:10},leftVal]} />
                
                <View style={[{flexDirection:"row"}]}>
                {buttons.map((item,index)=>{
                    return(
                        <Pressable style={{flex:1,marginHorizontal:300/8}} onPress={()=>setSelected(index)} key={index}>
                        <Text style={{fontFamily:"Poppins-Bold",color:selected != index ? "#fff" : Colors.light.text,zIndex:1}}>{item.title}</Text>
                        </Pressable>
                        )
                        })}
                        
                        </View>
                        </View> */}
            {selected==0 ?
                <View style={styles.container}>
                <Text style={{fontFamily:"Poppins-Bold",fontSize:23,paddingHorizontal:25,}}>Create Post</Text>
                <View style={[styles.userAccount , {width:185,marginTop:8}]}>
                    <View>
                        <Image source={{uri : user.data.profilePicture}} style={{width:50,height:50,borderRadius:50}} />
                    </View>
                    <View style={{marginLeft:6}}>
                        <Text style={{fontFamily:"Poppins-Light"}}>{user.data.username}</Text>
                        <Text style={{fontFamily:"Poppins-Bold",fontSize:12,marginTop:-5}}>Public</Text>
                    </View>
                </View>

                                        
                <View style={{justifyContent:"space-between",height:Dimensions.get('window').height-350}}>
                    <View style={{}}>

                        {/* <View style={styles.InputContainer}>
                            <View style={styles.textInput}>
                                <TextInput placeholder="Type Your Heading" style={styles.input} onChangeText={(e)=>setText(e)} />
                            </View>
                        </View> */}
                        <View style={styles.InputContainer}>
                            <View style={styles.textInput}>
                                <TextInput style={[styles.input,{paddingBottom:50}]} placeholder="Description" multiline={true} onChangeText={(e)=>setText(e)}/>
                            </View>
                        </View>
                    
                        {/* <View style={styles.InputContainer}>
                            <Text style={styles.headingText}>Upload Image</Text>
                            {image.length<1 ?                    
                                <TouchableOpacity style={{justifyContent:"center",alignItems:"center",borderWidth:1,borderRadius:5,padding:50}} onPress={selectImage}>
                                    <Feather name="upload-cloud" size={24} color="black"/>
                                </TouchableOpacity>
                                    :
                                <TouchableOpacity onPress={()=>setImage([])}>
                                    <Image source={{uri:image.uri}} height={300} style={{width:"100%",borderRadius:10}}/>

                                </TouchableOpacity>
                            }
                        </View> */}
                            </View>
                            <View style={{paddingHorizontal:27}}>
                                <Text style={{fontFamily:"Poppins-Bold"}}>Preview</Text>
                            </View>
                            <View style={{backgroundColor:"#fff",borderRadius:15,padding:10,width:Dimensions.get('window').width-50 ,alignSelf:"center"}}>
                                <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
                                    <View style={[styles.userAccount,{marginTop:0,paddingHorizontal:0}]}>
                                        <View>
                                            <Image source={{uri : user.data.profilePicture}} style={{width:30,height:30,borderRadius:50}} />
                                        </View>
                                        <View  style={{marginLeft:6}}>
                                            <Text style={{fontFamily:"Poppins-Light",fontSize:10}}>{user.data.username}</Text>
                                        </View>
                                    </View>
                                    <View style={{flexDirection:"row",alignItems:"center"}}>
                                        <View style={{backgroundColor:"#f2f2f2",borderRadius:30,paddingHorizontal:10,paddingVertical:5}}>
                                            <Text style={{fontFamily:"Poppins-Bold",fontSize:10}}>Follow</Text>
                                        </View>
                                        <TouchableOpacity onPress={()=>{
                                            Haptics.notificationAsync(
                                                Haptics.NotificationFeedbackType.Success
                                            )
                                        }}>
                                            <Entypo name="dots-three-vertical" size={15} color="black" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{marginVertical:5}}>
                                    {image.uri ?
                                    <View style={{position:"relative"}}>
                                        <Image source={{uri : image.uri}} style={{width:Dimensions.get('window').width-70,alignSelf:"center",height:200,borderRadius:15}} />
                                        <TouchableOpacity style={{position:"absolute" ,right:10, top:10}} onPress={() => setImage([])}>
                                            <AntDesign name="closecircle" size={24} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    <View style={{position:"relative"}}>
                                        <Image source={require('../../assets/images/user.jpg')} style={{width:Dimensions.get('window').width-70,alignSelf:"center",height:200,borderRadius:15}} />
                                    </View>
                                            
                                    }
                                </View>
                                <View style={{marginHorizontal:2}}>
                                    <Text style={{fontFamily:'Poppins-Light',fontSize:12}}>{text ? text : "Post Heading"}</Text>
                                </View>
                                <View style={styles.interactions}>
                                    <View style={{flexDirection:"row"}}>
                                        <TouchableOpacity style={styles.iconCont}>
                                            <AntDesign name="hearto" size={20} color="black"/>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.iconCont}>
                                            <Ionicons name="chatbubble-outline" size={20} color="black" />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.iconCont}>
                                            <Feather name="send" size={20} color="black" />
                                        </TouchableOpacity>
                                    </View>
                                    <View>
                                        <Feather name="bookmark" size={20} color="black" />
                                    </View>
                                </View>

                            </View>
                            <View style={{flexDirection:"row",alignItems:"center",alignSelf:"center",marginVertical:30}}>
                                <TouchableOpacity style={styles.uploadButton} onPress={uploadPost}>
                                        <Text style={{fontFamily:"Poppins-Bold",color:"#fff"}}>Upload Post</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.uploadIcons} onPress={selectImage}>
                                    <Ionicons name="image-outline" size={24} color="black" />            
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.uploadIcons}  onPress={selectImage}>
                                    <AntDesign name="videocamera" size={24} color="black" />                      
                                </TouchableOpacity>
                            </View>
            </View>
                </View>
                        :
                <CameraView facing={facing} style={{width:Dimensions.get('window').width,height:Dimensions.get('window').height}}>

                   <View style={{justifyContent:"flex-end",height:Dimensions.get('window').height-50}}>
                        <View style={styles.icons}>
                            <TouchableOpacity style={styles.iconProps} onPress={rotateCamera}>
                                <Feather name="rotate-cw" size={24} color="#fff" />
                            </TouchableOpacity>
                            <View style={{borderRadius:50,borderColor:Colors.light.text,borderWidth:2,width:70,height:70,justifyContent:"center",alignItems:"center"}}>
                                <View style={{backgroundColor:"#fff",width:55,height:55,borderRadius:50}}></View>
                            </View>
                                <View style={styles.iconProps}>
                                    <Feather name="rotate-cw" size={24} color="#fff" />
                                </View>
                            </View>
                   </View>
                </CameraView>


            }
        </ScrollView>
    )
}

export default Add

const styles = StyleSheet.create({
    container:{
        paddingVertical:45,
        height:Dimensions.get('window').height
    },
    userAccount:{
        marginTop:20,
        flexDirection:"row",
        alignItems:"center",
        paddingHorizontal:25,
    },
    textInput:{
        backgroundColor:"#fff",
        padding:13,
        borderRadius:10
    },
    InputContainer:{
        paddingHorizontal:25,
        marginVertical:15
    },
    input:{
        borderWidth:0,
        fontFamily:"Poppins-Light",
    },
    headingText:{
        fontFamily:"Poppins-Light", 
        fontSize:17,
        color:"#000"
    },
    uploadButton:{
        backgroundColor:"#d92b68",
        padding:12,
        borderRadius:30,
        alignItems:"center",
        width:Dimensions.get('window').width/1.7
    },
    icons:{
        flexDirection:"row",
        justifyContent:"space-between",
        paddingVertical:10,
        paddingHorizontal:30,
    },
    uploadIcons:{
        backgroundColor:"#fff",
        width:40,
        height:40,
        borderRadius:50,
        justifyContent:"center",
        alignItems:"center",
        marginLeft:5
    }
    ,interactions:{
        marginTop:5,
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        paddingVertical:5
    },
    iconCont:{
        flexDirection:"row",
        alignItems:"center",
        marginHorizontal:5
    },
    iconsText:{
        fontFamily:'Poppins-Light',
        marginHorizontal:5
    },
    iconProps:{borderRadius:50,backgroundColor:Colors.light.text,padding:10,width:55,height:55,justifyContent:"center",alignItems:"center"}
})