import BackArrow from "@/components/backArrow"
import { router, useLocalSearchParams } from "expo-router"
import { StyleSheet, View, Text} from "react-native"
import { useSelector } from "react-redux"
import { rootStore } from "../redux/store"
import CreatePostHeader from "@/components/createPostHeader"
import PostPreview from "@/components/postPreview"
import DescriptionBox from "@/components/descriptionBox"
import { useEffect, useState } from "react"
import UploadAcc from "@/components/uploadAcc"
import axios from "axios"
import { ipAddress } from "@/constants/ipAddress"
import * as ImagePicker from 'expo-image-picker';

function EditPost(){   
    const [text,setText] = useState("")
    const [postData,setPostData] = useState([])
    const [image,setImage] = useState([])
    const user  = useSelector((state:rootStore) => state.user.user)
    const {id} = useLocalSearchParams()
    async function UploadPost(){
        const data = new FormData()
        image.forEach((file) =>{
            data.append('image',{
                uri:file.uri,
                name:file.name,
                type:file.type
            })
        })
        data.append('text',text)
        const response = await axios.post(`http://${ipAddress}:3001/posts/update/${id}` ,data ,{
            headers:{
                'Content-Type': 'multipart/form-data',
                Authorization:`Bearer ${user?.token}`,
            }
        })
        console.log(response.data)
        router.push("/profile")
        
    }
    async function selectImage(){
        const pickImage = await ImagePicker.launchImageLibraryAsync({
            mediaTypes:ImagePicker.MediaTypeOptions.All,
            aspect:[4,3],
            quality:1,
            allowsMultipleSelection:true

        })
        if(!pickImage.canceled){
            const ImageDetails = pickImage.assets.map((image) =>({
                uri:image.uri,
                name: image.fileName,
                type: image.mimeType

            }))
            setImage(ImageDetails)
        }

    }

    async function GetPostData(){
        const respones = await axios.get(`http://${ipAddress}:3001/posts/get-post/${id}`,{
            headers:{
                Authorization : `Bearer ${user?.token}`
            }
        })
        console.log(respones.data.findPost.media)
        setPostData(respones.data.findPost)
        setText(respones.data.findPost.text)
        setImage(respones.data.findPost.media)
    }
    useEffect(() =>{
        GetPostData()
    },[])

    console.log(image)

    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <BackArrow/>
                <View style={{marginLeft:10}}>
                    <Text style={{fontFamily:"Poppins-Bold",fontSize:20}}>Edit Post</Text>
                </View>
            </View>
            <View style={{marginVertical:10}}>
                <CreatePostHeader user={user.data}/>
            </View>
            <View>
                <DescriptionBox onChange={setText} text={text}/>
            </View>
            <View>
                <View style={{paddingHorizontal:27}}>
                    <Text style={{fontFamily:"Poppins-Bold"}}>Preview</Text>
                </View>
                <PostPreview user={user.data} image={image} text={text} setImage={setImage}/>
            </View>
            <View>
                <UploadAcc uploadPost={UploadPost} selectImage={selectImage} placeholder="Save Post"/>
            </View>

        </View>
    )
        
}
export default EditPost

const styles  = StyleSheet.create({
    container:{
        paddingVertical:50,
        backgroundColor:"#fff",
        height:"100%"
    },
    header:{
        flexDirection:"row",
        paddingHorizontal:20,
        alignItems:"center"
    }
})