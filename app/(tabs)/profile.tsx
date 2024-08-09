import { StyleSheet, View ,Text, TouchableOpacity,Image, Dimensions, ScrollView, FlatList, RefreshControl, ToastAndroid, TextInput } from "react-native"
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
import { Colors } from "@/constants/Colors";
import ProfileActivity from "@/components/profileActivity";
import ProfileTabs from "@/components/profileTabs";
import { Skeleton } from "moti/skeleton";

function Profile() {
    const user = useSelector((state: rootStore) => state.user.user)
    const [profilePic, setProfilePic] = useState([])
    const [followerData, setFollowerData] = useState([])
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [refreshing, setRefreshing] = useState(false)
    const [likedPosts, setLikePosts] = useState([])
    const [editUsername, setEditUsername] = useState(false)
    const [username,setUsername] = useState(user.data.username)
    const [selected,setSelected] =  useState([])
    const [posts, setPosts] = useState([])
    const screenWidth = Dimensions.get('window').width
    const tabWidth = screenWidth / 3
    const dispatch = useDispatch()
    const position = useSharedValue(70)
    const scrollViewRef = useRef()

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

    async function CloudUpload(image) {
        const formData = new FormData()
        formData.append('image', {
            uri: image.uri,
            name: image.name,
            type: image.type,
        })

        const response = await axios.post(`http://${ipAddress}:3001/posts/upload-profile-pic/`, formData, {
            headers: {
                "Content-Type": 'multipart/form-data',
                Authorization: `Bearer ${user.token}`
            }
        })

        console.log(response.data.file)
        dispatch(updateProfilePic(response.data.file))
    }

    function Navigate() {
        router.push("/settings")
    }


    useEffect(() => {
        position.value = 0;
    }, [selectedIndex])

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
   
        }
    });

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
        const response = await axios.get(`http://${ipAddress}:3001/users/get-followers/${user.data._id}`, {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        })

        setFollowerData(response.data)
    }

    async function getPosts() {
        const response = await axios.get(`http://${ipAddress}:3001/posts/${user.data._id}`, {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        })
        setPosts(response.data.data)
    }

    function NavigateFollowing() {
        router.push({ pathname: `${user.data._id}/following` })
    }
    function NavigateFollowers() {
        router.push({ pathname: `${user.data._id}/followers` })
    }

    async function GetLikedPosts(){
        const response = await axios.get(`http://${ipAddress}:3001/users/get-user/${user.data._id}`,{
            headers:{
                Authorization:`Bearer ${user.token}`
            }
        })

        const likedPost = response.data.data.likes
        const data = {IDS : likedPost}
        const posts = await axios.post(`http://${ipAddress}:3001/posts/liked`,data,{
            headers:{
                Authorization:`Bearer ${user.token}`
            }
        })
        setLikePosts(posts.data.data)
    }

    async function DeletePosts(){
        const data = {"ids" : selected}
        const response = await axios.post(`http://${ipAddress}:3001/posts/delete-post/`,data,{
            headers:{
                Authorization : `Bearer ${user.token}`
            }
        })
        
        console.log(response.data)
        setSelected([])
        ToastAndroid.show("Posts Deleted Successfully",ToastAndroid.SHORT)
    }
    
    async function ChangeUsername(){
        if(username){
                const data = {"username":username}
                const response = await axios.post(`http://${ipAddress}:3001/users/change-username/`,data,{
                    headers:{
                        Authorization: `Bearer ${user.token}`
                    }
                }) 
                console.log(response.data)
        
                setEditUsername(false)
            }
            else{
            setUsername(user.data.username)
            setEditUsername(false)
            
        }
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

    useEffect(()=>{
        setSelectedIndex(0)
        position.value=40
    },[])

    function ResetUsername(){
        setEditUsername(false)
        setUsername(user.data.username)

    }


    return (
        <ScrollView showsVerticalScrollIndicator={false} refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refreshProfile}/>
        }>
            {selected.length>0 && 
                        
                <View style={{backgroundColor:"#fff",justifyContent:"center",width:Dimensions.get("window").width,height:Dimensions.get('window').height/8,position:"absolute",left:0,top:0,elevation:10,shadowColor:"#000",zIndex:1}}>
                    <View style={{flexDirection:"row",justifyContent:"space-between",paddingHorizontal:20,marginTop:20}}>
                            <View>
                                <Text style={{fontFamily:"Poppins-Regular",fontSize:18}}>{selected && selected.length} Selected</Text>
                            </View>
                            <View style={{flexDirection:"row",width:55,justifyContent:"space-between"}}>
                                <TouchableOpacity onPress={DeletePosts}>
                                    <MaterialIcons name="delete-outline" size={24} color="black" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setSelected([])}>
                                    <MaterialCommunityIcons name="close-circle-outline" size={24} color="black" />
                                </TouchableOpacity>
                            </View>
                    </View>
                </View>
            }
            <View style={[styles.header]}>
                <BackArrow />
                <View>
                    <Text style={{ fontFamily: "Poppins-Bold", fontSize: 19 }}>@{user && user.data.username}</Text>
                </View>
                <TouchableOpacity style={{
                    backgroundColor: "#ccc",
                    padding: 5,
                    borderRadius: 5
                }} onPress={Navigate}>
                    <AntDesign name="setting" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <View style={styles.details}>
                <View style={styles.profilePic}>
                    <View>
                        {user.data.profilePicture.length > 5 ?
                            <Image source={{ uri: user.data.profilePicture }} style={{ width: 100, height: 100, borderRadius: 20 }} />
                            :
                            <Image source={require("../../assets/images/model.jpg")} style={{ width: 100, height: 100, borderRadius: 20 }} />
                        }
                        <TouchableOpacity style={{ position: 'absolute', bottom: -10, right: -10, backgroundColor: "#fff", padding: 5, borderRadius: 50, height: 40, width: 40, justifyContent: "center", alignItems: "center" }} onPress={UpdateProfilePic}>
                            <Feather name="edit-2" size={20} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ marginVertical: 10 }}>
                    <View style={{flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                        <TextInput onChangeText={setUsername} value={username} style={{ fontFamily: "Poppins-Bold", textAlign: "center", fontSize: 15,color:"#000"}} editable={editUsername}/>
                        {/* <Text style={{ fontFamily: "Poppins-Bold", textAlign: "center", fontSize: 15 }}>{user && user.data.username}</Text> */}
                        {!editUsername ?                    
                            <TouchableOpacity style={{marginLeft:10}} onPress={() => setEditUsername((prev) => !prev)}>
                                <Feather name="edit-2" size={10} color="black" />
                            </TouchableOpacity>
                            :
                            <>                            
                            <TouchableOpacity style={{marginLeft:10}} onPress={ChangeUsername}>
                                <AntDesign name="checkcircleo" size={15} color="black" />                 
                            </TouchableOpacity>
                            <TouchableOpacity style={{marginLeft:10}} onPress={ResetUsername}>
                                <AntDesign name="closecircleo" size={15} color="black" />          
                            </TouchableOpacity>
                            </>
                        }
                    </View>
                    <Text style={{ textAlign: "center", fontFamily: "Poppins-Light" }}>Machine Learning Engineer & Data Scientist</Text>
                </View>
                <View style={styles.boxLayout}>
                    <TouchableOpacity style={styles.box} onPress={NavigateFollowing}>
                        <Text style={{ fontFamily: "Poppins-Bold" }}>120</Text>
                        <Text style={{ fontFamily: "Poppins-Regular" }}>Following</Text>
                        <View style={styles.line}></View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.box} onPress={NavigateFollowers}>
                        <Text style={{ fontFamily: "Poppins-Bold" }}>120</Text>
                        <Text style={{ fontFamily: "Poppins-Regular" }}>Followers</Text>
                        <View style={styles.line}></View>
                    </TouchableOpacity>
                    <View style={styles.box}>
                        <Text style={{ fontFamily: "Poppins-Bold" }}>120</Text>
                        <Text style={{ fontFamily: "Poppins-Regular" }}>Posts</Text>
                    </View>
                </View>
            </View>
            <View>

                <ProfileTabs selectedIndex={selectedIndex} TabClick={TabClick} position={position}/>
                {/* Tab 1 */}
                <Animated.ScrollView
                    ref={scrollViewRef}
                    horizontal
                    pagingEnabled
                    scrollEventThrottle={16}
                    onScroll={scrollHandler}
                    onMomentumScrollEnd={(event) => {
                        const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth)
                        setSelectedIndex(index)
                        setTimeout(()=>{

                            position.value=40
                        },300)
                    }}
                >
                    <View style={{width:Dimensions.get('window').width}}>
                        <FlatList data={posts} numColumns={3}  keyExtractor={(item) => item._id }  renderItem={({item}) =>{
                            const isImage = item.image
                            return(
                                <View  >
                                    <ProfileActivity item={item} isImage={isImage} userId={user.data._id} setSelected={setSelected} selected={selected}/>
                                </View>
                                    
                            )
                        }}/>
                    </View>
                    {/* Tab 2 */}
                <View style={{width:Dimensions.get('window').width}}>
                    <FlatList data={likedPosts}  numColumns={3} keyExtractor={(item) => item}  renderItem={({item}) => {
                        return(
                                <TouchableOpacity onPress={() => router.push("/profileLike")}>
                                    <Image source={{uri:item.image}} style={styles.postLayout} />
                                </TouchableOpacity>
                        )
                    }} />
                </View>

                    {/* Tab 3 */}
                    <View style={{ flexDirection: "row", width: screenWidth, flexWrap: "wrap"}}>
                        <View>
                            <Image source={require("../../assets/images/valorant.jpeg")} style={styles.postLayout} />
                        </View>
                        <View>
                            <Image source={require("../../assets/images/model.jpg")} style={styles.postLayout} />
                        </View>
                        <View>
                            <Image source={require("../../assets/images/valorant.jpeg")} style={styles.postLayout} />
                        </View>
                        <View>
                            <Image source={require("../../assets/images/valorant.jpeg")} style={styles.postLayout} />
                        </View>
                        <View>
                            <Image source={require("../../assets/images/valorant.jpeg")} style={styles.postLayout} />
                        </View>
                    </View>
                </Animated.ScrollView>
            </View>
        </ScrollView>
    )
}

export default Profile

const styles = StyleSheet.create({
    container: {
        paddingVertical: 15,
        paddingHorizontal: 25
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
        backgroundColor: "#000",
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
    }
})
