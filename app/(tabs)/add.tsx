import BackArrow from "@/components/backArrow"
import {View,Text, StyleSheet, TextInput, TouchableOpacity, Image,ScrollView, Pressable, Dimensions} from "react-native"
import * as ImagePicker from 'expo-image-picker'
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ipAddress } from "@/constants/ipAddress";
import { useSelector } from "react-redux";
import { rootStore } from "../redux/store";
import { router } from "expo-router";
import { AntDesign,Ionicons,Feather,Entypo } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { CameraView } from "expo-camera";
import {actions, RichEditor, RichToolbar} from "react-native-pell-rich-editor";
import * as Haptics from "expo-haptics"
import CreatePostHeader from "@/components/createPostHeader";
import PostPreview from "@/components/postPreview";
import DescriptionBox from "@/components/descriptionBox";
import UploadAcc from "@/components/uploadAcc";
import UploadReel from "@/components/UploadReel";
import { categiores } from "@/components/createCategories";
import { ColorPalatte } from "@/constants/Colors";
const Colors = ColorPalatte()


function Add(){
    const {width:SCREEN_WIDTH,height:SCREEN_HEIGHT} = Dimensions.get('window')
    const [image,setImage]  = useState([])
    const [text,setText] = useState('')
    const [description,setDescription] = useState('')
    const [selected,setSelected] = useState(0)
    const [selectedTab,setSelectedTab] = useState(0)
    const [loading,setLoading] = useState(false)
    const user = useSelector((state:rootStore) => state.user.user)
    const backgroundPosition = useSharedValue(15)
    const scrollRef = useRef()
    const buttons = [{title:"Upload"},{title:"Camera"}]
    const [facing,setFacing] = useState('back')
    const  itemWidth = Dimensions.get('window').width /2
    const selectImage = async () =>{
        const pickImage = await ImagePicker.launchImageLibraryAsync({
            mediaTypes:ImagePicker.MediaTypeOptions.All,
            allowsEditing:true,
            aspect:[4,3],
            quality:1,
            // allowsMultipleSelection:true
        })
        if(!pickImage.canceled){
            if(pickImage.assets[0].type == "image"){
                console.log("Image")
            }
            else{
                console.log("Video")
            }
            console.log(pickImage.assets[0])
            const uri = pickImage.assets && pickImage.assets[0].uri
            if(!pickImage.canceled){
                setImage({
                    uri,
                     name: pickImage.assets[0].fileName || 'photo.jpg',
                     type: pickImage.assets[0].mimeType || 'image/jpeg'
                })
            }
            console.log(pickImage.assets)
        }
    }

    async function uploadPost(){
        setLoading(true)
        const data = new FormData()
        data.append('image',{uri: image.uri,name: image.name,type: image.type})
        data.append('text',text)
        data.append('description',description)
        console.log(data)
        const response = await axios.post(`http://${ipAddress}:3001/posts/create-post`,data,{
            headers:{
                'Content-Type': 'multipart/form-data',
                Authorization:`Bearer ${user.token}`
            }
        })
        console.log("HEHE")
        setLoading(false)
        setImage([])
        setText("")
        router.push("/home")
    }
    
    async function uploadReel(){
        try{
            setLoading(true)
            const data = new FormData()
            data.append('image',{uri: image.uri,name: image.name,type: image.type})
            data.append('text',text) 
            const response = await axios.post(`http://${ipAddress}:3001/posts/create-reel`,data,{
                headers:{
                    'Content-Type': 'multipart/form-data',
                    Authorization:`Bearer ${user.token}`
                }
            })
            setLoading(false)
            setImage([])
            setText("")
            console.log(response.data)
        }
        
        catch(error){
            console.log(error)
            setLoading(false)
            
        }
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

    const lineStyle = useAnimatedStyle(() =>{
        return{
            left: withTiming(itemWidth/categiores.length  * selectedTab +25)
        }
    })

    function TabClick(index:number){
        setSelectedTab(index)
        scrollRef.current.scrollTo({
            x:SCREEN_WIDTH * index
        })
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
                <Text style={[styles.textColor,{fontFamily:"Poppins-Bold",fontSize:23,paddingHorizontal:25}]}>Create {categiores[selectedTab]}</Text>
                <View style={styles.tabs}>
                    <Animated.View style={[{backgroundColor:Colors.light.text,width:200/7,justifyContent:"center",height:3,borderRadius:50,position:"absolute",bottom:-5},lineStyle]}/>
                    {categiores && categiores.map((item,index) =>{
                        return(
                            <TouchableOpacity style={{width:itemWidth/categiores.length , alignItems:"center",justifyContent:"center"}} onPress={() =>TabClick(index)}>
                                <Text style={[styles.textColor,{fontFamily:"Poppins-Light"}]}>{item}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>

                <CreatePostHeader user={user?.data}/>
                <ScrollView 
                ref={scrollRef} 
                horizontal 
                onMomentumScrollEnd={(event) =>{
                    const index = Math.round(event.nativeEvent.contentOffset.x)
                    setSelectedTab(index/SCREEN_WIDTH)
                }}
                pagingEnabled>
                    <View style={{width:Dimensions.get('window').width}}>
                        <View style={{justifyContent:"space-between",height:Dimensions.get('window').height-350}}>
                                    <View>
                                        <DescriptionBox onChange={setText} text={text}/>
                        
                                    </View>
                                    <View style={{paddingHorizontal:27}}>
                                        <Text style={[styles.textColor,{fontFamily:"Poppins-Bold"}]}>Preview</Text>
                                    </View>
                                    <PostPreview user={user?.data} image={image} text={text} setImage={setImage}/>
                                    <UploadAcc uploadPost={uploadPost} selectImage={selectImage} placeholder="Upload Post" loading={loading}/>
                         </View>
                    </View>
                    <View style={{width:Dimensions.get('window').width}}>
                        <View style={{justifyContent:"space-between",height:Dimensions.get('window').height-350}}>
                                    <View>
                                        <DescriptionBox onChange={setText} text={text}/>
                        
                                    </View>
                                    <View style={{paddingHorizontal:27}}>
                                        <Text style={[styles.textColor,{fontFamily:"Poppins-Bold"}]}>Preview</Text>
                                    </View>
                                    {/* <PostPreview user={user.data} image={image} text={text} setImage={setImage}/> */}
                                    <UploadReel user={user?.data} image={image} text={text} setImage={setImage}/>
                                    <UploadAcc uploadPost={uploadReel} selectImage={selectImage} placeholder="Upload Reel"  loading={loading}/>
                         </View>
                    </View>
                    <View style={{width:Dimensions.get('window').width}}>
                        <View style={{justifyContent:"space-between",height:Dimensions.get('window').height-350}}>
                                    <View>
                                        <DescriptionBox onChange={setText} text={text}/>
                        
                                    </View>
                                    <View style={{paddingHorizontal:27}}>
                                        <Text style={[styles.textColor,{fontFamily:"Poppins-Bold"}]}>Preview</Text>
                                    </View>
                                    <PostPreview user={user?.data} image={image} text={text} setImage={setImage}/>
                                    <UploadAcc uploadPost={uploadPost} selectImage={selectImage} placeholder="Upload Snap" loading={loading} />
                         </View>
                    </View>
                </ScrollView>

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
        paddingVertical:40,
        height:Dimensions.get('window').height,
        backgroundColor:Colors.theme.backgroundColor
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
    tabs:{
        flexDirection:"row",
        position:"relative",  
        marginVertical:10,
        paddingHorizontal:10,
    },
    textColor:{
        color:Colors.theme.fontColor
    },
    iconProps:{borderRadius:50,backgroundColor:Colors.light.text,padding:10,width:55,height:55,justifyContent:"center",alignItems:"center"}
})