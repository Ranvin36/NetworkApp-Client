import { StyleSheet, View ,Text, TouchableOpacity,Image, Dimensions, ScrollView, FlatList, RefreshControl, ToastAndroid, TextInput, ActivityIndicator } from "react-native"
import { Feather, AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons , MaterialIcons } from '@expo/vector-icons';
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { rootStore } from "../redux/store";
import BackArrow from "../../components/backArrow";
import { updateProfilePic } from "../redux/userSlice";
import * as ImagePicker from 'expo-image-picker'
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { ipAddress } from "@/constants/ipAddress";
import Animated, { useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { ResizeMode, Video } from "expo-av";
import ProfileActivity from "@/components/profileActivity";
import ProfileTabs from "@/components/profileTabs";
import { Skeleton } from "moti/skeleton";
import { ColorPalatte } from "@/constants/Colors";
import Modal from "@/components/Modal";
import { useNavigation } from "@react-navigation/native";
const Colors = ColorPalatte()

type ProfilePicture={
    uri: string,
    name: string,
    type: string,
}

type PostTypes={
    _id: number,
    user_id: number,
    title: string,
    image: string | null,
    video: string | null,
    likes: any,
    comments: any,
    created_at: string,
    updated_at: string,
    creator: [{
        id: number,
        userId: string,
        username: string,
        profile_pic: string | null,
        created_at: string,
        updated_at: string,
    }]
}

function Profile() {
    const user = useSelector((state: rootStore) => state.user.user)
    const [profilePic, setProfilePic] = useState<ProfilePicture[] | null>(null)
    const [followerData, setFollowerData] = useState([])
    const [likedPosts, setLikePosts] = useState([])
    const [bookmarkedPosts, setBookmarkedPosts] = useState([])
    const [selected,setSelected] =  useState([])
    const [clips,setClips] =  useState([])
    const [posts, setPosts] = useState<PostTypes[]>([])
    const [refreshing, setRefreshing] = useState(false)
    const [loading,setLoading]  = useState(false)
    const [popupOpened,setPopUpOpened]  = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [username, setUsername] = useState<string>(user?.data?.username ?? '');
    const dispatch = useDispatch()
    const position = useSharedValue(70)
    const scrollViewRef = useRef()
    const postLayout = Dimensions.get('window').width / 3
    const screenWidth = Dimensions.get('window').width
    const post = posts.filter((item) => item.image) 

    async function UpdateProfilePic() {
        const selectImage = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            aspect: [4, 3],
            allowsEditing: true,
            quality: 1
        })

        if (!selectImage.canceled) {
            const uri = selectImage.assets[0].uri
            setProfilePic({
                uri,
                name: selectImage.assets[0].fileName,
                type: selectImage.assets[0].mimeType
            })
            await CloudUpload({
                uri,
                name: selectImage.assets[0].fileName,
                type: selectImage.assets[0].mimeType
            })
        }
    }

    async function CloudUpload(image:ProfilePicType) {
        setLoading(true)
        const formData = new FormData()
        formData?.append('image', {
            uri: image.uri,
            name: image.name,
            type: image.type,
        })
        
        const response = await axios.post(`http://${ipAddress}:3001/posts/upload-profile-pic/`, formData, {
            headers: {
                "Content-Type": 'multipart/form-data',
                Authorization: `Bearer ${user?.token}`
            }
        })
        
        setLoading(false)
        console.log(response.data.file)
        dispatch(updateProfilePic(response.data.file))
    }

    function Navigate() {
        router.push("/settings")
    }


    useEffect(() => {
        position.value = 0;
    }, [selectedIndex])


    function TabClick(index: number) {
        setSelectedIndex(index)
        setTimeout(()=>{
            position.value=40
        },300)
        scrollViewRef.current?.scrollTo({
            x: index * screenWidth,
            animated: true
        })
    }

    async function GetFollowers() {
        const response = await axios.get(`http://${ipAddress}:3001/users/get-followers/${user?.data._id}`, {
            headers: {
                Authorization: `Bearer ${user?.token}`
            }
        })

        console.log(response?.data , "FOLLOWS")

        setFollowerData(response.data)
    }

    async function getPosts() {
        const response = await axios.get(`http://${ipAddress}:3001/posts/${user?.data._id}`, {
            headers: {
                Authorization: `Bearer ${user?.token}`
            }
        })
        setPosts(response.data.data)
    }

    function NavigateFollowing() {
        router.push({ pathname: `${user?.data?._id}/following` })
    }
    function NavigateFollowers() {
        router.push({ pathname: `${user?.data._id}/followers` })
    }

    async function GetLikedPosts(){
        setLoading(true)
        const response = await axios.get(`http://${ipAddress}:3001/users/get-user/${user?.data._id}`,{
            headers:{
                Authorization:`Bearer ${user?.token}`
            }
        })
        
        const likedPost = response.data.data.likes
        const data = {IDS : likedPost}
        const posts = await axios.post(`http://${ipAddress}:3001/posts/liked`,data,{
            headers:{
                Authorization:`Bearer ${user?.token}`
            }
        })
        setLikePosts(posts.data.data)
        setLoading(false)
    }

    async function GetClips(){
        const response = await axios.get(`http://${ipAddress}:3001/reels/clips/${user?.data._id}`,{
            headers:{
                Authorization:`Bearer ${user?.token}`
            }
        })
        console.log(response.data)
        if(response.data.findClip){
            setClips([response.data.findClip])
            return
        }
        setClips([])
    }

    async function GetBookmarkedPosts(){
        const response = await axios.get(`http://${ipAddress}:3001/users/get-user/${user?.data._id}`,{
            headers:{
                Authorization:`Bearer ${user?.token}`
            }
        })
        const bookmarkedPosts = response.data.data.bookmarks
        const data={IDS:bookmarkedPosts}
        const bookmarks = await axios.post(`http://${ipAddress}:3001/posts/bookmarks`,data,{
            headers:{
                Authorization: `Bearer ${user?.token}`
            }
        })
        setBookmarkedPosts(bookmarks.data.data)
    }

    useEffect(() => {
        GetBookmarkedPosts()
    },[])


    async function DeletePosts(){
        setLoading(true)
        try{
            const data = {"ids" : selected}
            const response = await axios.post(`http://${ipAddress}:3001/posts/delete-post/`,data,{
                headers:{
                    Authorization : `Bearer ${user?.token}`
                }
            })
            
            console.log(response.data)
            setSelected([])
            ToastAndroid.show("Posts Deleted Successfully",ToastAndroid.SHORT)
        }
        
        catch(error){
            console.log(error)
            ToastAndroid.show("Failed To Delete Post",ToastAndroid.SHORT)
        }
        setPopUpOpened(false)
        setLoading(false)
    }
    

    async function PopUpController(){
        setPopUpOpened((prev) => !prev)
    }

    async function DeleteChat(){

    }

    const refreshProfile = useCallback(async() =>{
        setRefreshing(true)
        setTimeout(() =>{
            setRefreshing(false)
        },3000)
    },[])
    

    useEffect(() => {
        GetLikedPosts()
    },[refreshing])

    useEffect(() => {
        GetFollowers()
    }, [])
    useEffect(() => {
        getPosts()
    }, [refreshing])

    useEffect(() =>{
        GetClips()
    },[])

    useEffect(()=>{
        setSelectedIndex(0)
        position.value=40
    },[])



    return (
        <ScrollView style={styles.container}  showsVerticalScrollIndicator={false} refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refreshProfile}/>
        }>
            <Modal popupOpened={popupOpened} PopUpController={PopUpController} DeleteChat={DeletePosts} loading={loading}>
                Are You Sure You Want To Delete These Posts?
            </Modal>
            {selected.length>0 && 
                        
                <View style={styles.selectedActions}>
                    <View style={{flexDirection:"row",justifyContent:"space-between",paddingHorizontal:20,marginTop:20}}>
                            <View>
                                <Text style={{fontFamily:"Poppins-Regular",fontSize:18}}>{selected && selected.length} Selected</Text>
                            </View>
                            <View style={{flexDirection:"row",width:55,marginRight:18,justifyContent:"space-between"}}>
                                <TouchableOpacity onPress={PopUpController} style={styles.icons}>
                                    <MaterialIcons name="delete-outline" size={24} color={Colors.theme.fontColor} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.icons} onPress={() => router.push({pathname:`/editPost/${selected[0]}` ,params:{id:selected[0]}})}>
                                    <Feather name="edit-2" size={22} color={Colors.theme.fontColor} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setSelected([])} style={styles.icons}>
                                    <MaterialCommunityIcons name="close-circle-outline" size={24} color={Colors.theme.fontColor} />
                                </TouchableOpacity>
                            </View>
                    </View>
                </View>
            }
            <View style={[styles.header]}>
                <BackArrow />
                <View>
                    <Text style={[styles.textColor,{ fontFamily: "Poppins-Bold", fontSize: 19 }]}>@{user && user.data.username}</Text>
                </View>
                <TouchableOpacity style={{
                    backgroundColor: Colors.theme.backgroundTransparent,
                    padding: 5,
                    borderRadius: 5
                }} onPress={Navigate}>
                    <AntDesign name="setting" size={24} color={Colors.theme.fontColor} />
                </TouchableOpacity>
            </View>
            <View style={styles.details}>
                <View style={styles.profilePic}>
                    <View>
                        {user?.data?.profilePicture.length > 5 ?
                            <Image source={{ uri: user?.data.profilePicture }} style={{ width: 100, height: 100, borderRadius: 20 }} />
                            :
                            <Image source={require("../../assets/images/model.jpg")} style={{ width: 100, height: 100, borderRadius: 20 }} />
                        }
                        <TouchableOpacity style={{ position: 'absolute', bottom: -10, right: -10, backgroundColor:Colors.theme.commentsBg, padding: 5, borderRadius: 50, height: 40, width: 40, justifyContent: "center", alignItems: "center" }} onPress={UpdateProfilePic}>
                            {loading? <ActivityIndicator/>  : <Feather name="edit-2" size={20} color={Colors.theme.fontColor} /> }
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ marginVertical: 10 }}>
                    <View style={{flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                        <TextInput onChangeText={setUsername} value={username} style={[styles.textColor,{ fontFamily: "Poppins-Bold", textAlign: "center", fontSize: 15}]}/>

                    </View>
                    <Text style={[styles.textColor,{ textAlign: "center", fontFamily: "Poppins-Light"}]}>{user?.data.bio && user?.data.bio}</Text>
                </View>
                <View style={styles.boxLayout}>
                    <TouchableOpacity style={styles.box} onPress={NavigateFollowing}>
                        <Text style={[styles.textColor,{ fontFamily: "Poppins-Bold"}]}>{followerData && followerData.length>0 &&  followerData[0].followingDetails.length}</Text>
                        <Text style={[styles.textColor,{ fontFamily: "Poppins-Regular"}]}>Following</Text>
                        <View style={styles.line}></View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.box} onPress={NavigateFollowers}>
                        <Text style={[styles.textColor,{ fontFamily: "Poppins-Bold"}]}>{followerData && followerData.length>0 &&  followerData[0].followersDetails.length}</Text>
                        <Text style={[styles.textColor,{ fontFamily: "Poppins-Regular"}]}>Followers</Text>
                        <View style={styles.line}></View>
                    </TouchableOpacity>
                    <View style={styles.box}>
                    <Text style={[styles.textColor,{ fontFamily: "Poppins-Bold"}]}>{post && post.length}</Text>
                    <Text style={[styles.textColor,{ fontFamily: "Poppins-Regular"}]}>Posts</Text>
                    </View>
                </View>
            </View>
            <View>

                <ProfileTabs selectedIndex={selectedIndex} TabClick={TabClick} position={position} profileView={true}/>
                {/* Tab 1 */}
                <Animated.ScrollView
                    ref={scrollViewRef}
                    horizontal
                    pagingEnabled
                    scrollEventThrottle={16}
                    onMomentumScrollEnd={(event) => {
                        const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth)
                        setSelectedIndex(index)
                        setTimeout(()=>{

                            position.value=40
                        },300)
                    }}
                >
                    <View style={{width:Dimensions.get('window').width}}>
                        <FlatList data={posts} numColumns={3}  keyExtractor={(item) => item?._id }  renderItem={({item,index}) =>{
                            const isImage = item.media && item.media[0].uri
                            return(
                                <View>
                                    <Skeleton width={postLayout} height={200} colorMode="light" radius='square'>
                                        {loading ? null :
                                            <ProfileActivity item={item} index={index} isImage={isImage} userId={user?.data._id} setSelected={setSelected} selected={selected}/> 
                                        }
                                    </Skeleton>
                                </View>
                                    
                            )
                        }}/>
                    </View>
                    <View style={{width:Dimensions.get('window').width}}>
                        <FlatList data={clips} numColumns={3}  keyExtractor={(item) => item?._id }  renderItem={({item}) =>{
                            const isImage = false
                            return(
                                <View>
                                    <Skeleton width={postLayout} height={200} colorMode="light" radius='square'>
                                        {loading ? null :
                                            <ProfileActivity index={index} item={item} isImage={isImage} userId={user?.data._id} setSelected={setSelected} selected={selected}/> 
                                        }
                                    </Skeleton>
                                </View>
                            )
                        }}/>
                    </View>

                <View style={{width:Dimensions.get('window').width}}>
                    <FlatList data={bookmarkedPosts}  numColumns={3} keyExtractor={(item) => item}  renderItem={({item}) => {
                        const isImage = item.media  && item.media[0]
                        return(
                            <Skeleton width={postLayout} height={200} colorMode="light" radius='square'>
                                {loading ? null :  
                                <TouchableOpacity onPress={() => router.push("/profileLike")}>
                                    {isImage ? 
                                    <Image source={{uri:isImage.uri}} style={styles.postLayout} /> 
                                    : 
                                    <Image source={require("../../assets/images/model.jpg")} style={styles.postLayout} /> 
                                    }
                                </TouchableOpacity>
                                }
                            </Skeleton>
                        )
                    }} />
                    </View>
                   
                </Animated.ScrollView>
            </View>
        </ScrollView>
    )
}

export default Profile

const styles = StyleSheet.create({
    container: {
        backgroundColor:Colors.theme.backgroundColor,
        height:"100%"
    },
    header: {
        paddingVertical: 7,
        paddingHorizontal: 25,
        marginTop: 38,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    details: {
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 20
    },
    profilePic: {
        position: "relative"
    },
    boxLayout: {
        flexDirection: "row",
        padding: 10,
        marginVertical: -10
    },
    box: {
        width: 100,
        borderColor: "#ccc",
        margin: 5,
        padding: 5,
        borderRadius: 10,
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    line: {
        position: "absolute",
        right: -10,
        backgroundColor: Colors.theme.fontColor,
        width: 1,
        height: 20
    },
    tabs: {
        width: 100,
        height: 40,
        alignItems: "center"
    },
    postLayout: {
        width: Dimensions.get('window').width / 3,
        height: 200
    },
    icons:{
        marginRight:5
    },
    textColor:{
        color:Colors.theme.fontColor
    },
    selectedActions:{backgroundColor:"#fff",
    justifyContent:"center",
    width:Dimensions.get("window").width,
    height:Dimensions.get('window').height/8,
    position:"absolute",
    left:0,
    top:0,
    elevation:10,
    shadowColor:"#000",
    zIndex:1}
})
