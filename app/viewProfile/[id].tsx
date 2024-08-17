import { ipAddress } from "@/constants/ipAddress"
import axios from "axios"
import { useLocalSearchParams } from "expo-router"
import { useEffect,useState,useRef,useCallback} from "react"
import { StyleSheet, Text, View,Image, TouchableOpacity, Dimensions, FlatList} from "react-native"
import { useSelector } from "react-redux"
import { rootStore } from "../redux/store"
import { router } from "expo-router"
import ProfileTabs from "@/components/profileTabs"
import Animated, { useSharedValue,scrollTo, useAnimatedStyle, withSpring, useDerivedValue, runOnJS, useAnimatedReaction } from "react-native-reanimated"
import ProfileActivity from "@/components/profileActivity"
import BackArrow from "@/components/backArrow"
import { Entypo } from "@expo/vector-icons"
import { Video,ResizeMode } from "expo-av"
import { Colors } from "@/constants/Colors"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import  {FollowUser,UnFollowUser} from "../../components/CallBacks/CallBackFunctions"

function Page(){
  const {width:SCREEN_WIDTH , height:SCREEN_HEIGHT} = Dimensions.get('window')
  const {id} = useLocalSearchParams()
  const user = useSelector((state:rootStore)=>state.user)
  const [profileUser,setProfileUser] = useState([])
  const [selectedIndex,setSelectedIndex] = useState(0)
  const [selected, setSelected] = useState([])
  const [followCount, setFollowCount] = useState([])
  const [follows, setFollows] = useState([])
  const [posts,setPosts] = useState([])
  const position = useSharedValue(40)
  const [bottomSheetOpened,setBottomSheetOpened] = useState(false)
  const scrollViewRef = useRef()
  const offSet = useSharedValue(SCREEN_HEIGHT)
  const context = useSharedValue(0)
  const isBottomSheetOpened = useDerivedValue(() => offSet.value == 0 )
  const postVideo = posts &&  posts.filter((item) => item.video)
  const postImages= posts &&  posts.filter((item) => item.image)
  const gesture = Gesture.Pan().onStart((event) =>{
      context.value = offSet.value
  }).onUpdate((event) =>{
      offSet.value = event.translationY + context.value
      offSet.value = Math.max(offSet.value , -SCREEN_HEIGHT/10)
  }).onEnd((event) =>{
      if(offSet.value > -SCREEN_HEIGHT/30){
          offSet.value=withSpring(SCREEN_HEIGHT , {damping:50})
      }
      else if(offSet.value > -SCREEN_HEIGHT/20){
          offSet.value=withSpring(0 , {damping:50})
      }
      if(offSet.value < -SCREEN_HEIGHT/30){
          offSet.value=withSpring(0 , {damping:50})
      }
  })

    useAnimatedReaction(() => isBottomSheetOpened.value,
    (isOpen) =>{
        runOnJS(setBottomSheetOpened)(isOpen)
    }
  )

  async function GetUser(){
    const response  = await axios.get(`http://${ipAddress}:3001/users/get-user/${id}`,{
        headers:{
            Authorization:`Bearer ${user.user.token}`
        }
    })
    setProfileUser(response.data.data)
  }

  async function GetPosts(){
    const response = await axios.get(`http://${ipAddress}:3001/posts/${id}`,{
      headers:{
        Authorization:`Bearer ${user.user.token}`
      }
    })

    setPosts(response.data.data)
  }

  function ViewFollowers(){
    router.push({pathname:`${id}/followers`})
  }
  
  function ViewFollowing(){
    router.push({pathname:`${id}/following`})
  }

  function TabClick(index: number) {
    setSelectedIndex(index)
    setTimeout(()=>{
        position.value=40
    },300)
    scrollViewRef.current?.scrollTo({
        x: index * SCREEN_WIDTH,
        animated: true
    })
}

  function openBottomSheet(){
    if(bottomSheetOpened){
        offSet.value=withSpring(SCREEN_HEIGHT , {damping:50})
    }
    else{
      offSet.value=withSpring(0 , {damping:50})

    }    
  }

  const animateBottomSheet = useAnimatedStyle(() =>{
    return{
      transform: [{translateY:offSet.value}]
    }
  })
  
  async function HandleFollowUser(){
    await FollowUser(id,user,setFollowCount)
}
async function HandleUnfollowUser(){
    await UnFollowUser(id,user,setFollowCount)
}

const GetFollowers = useCallback(async () =>{
  const response = await axios.get(`http://${ipAddress}:3001/users/get-followers/${user.user.data._id}`,{
      headers:{
          Authorization:`Bearer ${user.user.token}`
      }
  })
  setFollows(response.data[0].following)
},[user.user.data._id, user.user.token])

  useEffect(()=>{
    GetUser()
  },[])

  useEffect(()=>{
    GetPosts()
  },[])

  useEffect(()=>{
    GetFollowers()
  },[])

  useEffect(() => {
    position.value = 0;
  }, [selectedIndex])

  useEffect(()=>{
    setSelectedIndex(0)
    position.value=40
  },[])

  const isFollowing = follows.filter((item) => item._id ===  id) 
  console.log(isFollowing)

  return(
    <View>
      <View style={styles.container}>
          <TouchableOpacity style={{position:"absolute" , backgroundColor:"#000",opacity:0.5, display:offSet.value == 0  ?"flex" :"none", width:Dimensions.get('window').width , left:0, top:0,height:SCREEN_HEIGHT,zIndex:1}} onPress={openBottomSheet}></TouchableOpacity>
        
        <View style={{flexDirection:"row",justifyContent:"space-between",marginVertical:20,paddingHorizontal:20,alignItems:"center"}}>
          <View>
            <BackArrow/>
          </View>
          <View>
            <Text style={{fontFamily:"Poppins-Bold",fontSize:16}}>@Himaz Rox</Text>
          </View>
          <TouchableOpacity onPress={openBottomSheet}>
            <Entypo name="dots-three-vertical" size={20} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.pageHeader}>
            <View style={{alignItems:"center"}}>
                <View style={{alignItems:"center",}}>
                  <Image source={{uri:profileUser.profilePicture}} style={{width:100,height:100,borderRadius:20}}/>
                </View>
                <View style={{marginVertical:10}}>
                  <Text style={{fontFamily:"Poppins-Bold",marginLeft:10,fontSize:19,textAlign:"center"}}>{profileUser.username}</Text>
                </View>
            </View>
        </View>
        <View style={{alignItems:"center"}}>
          <View style={styles.boxLayout}>
                            <TouchableOpacity style={styles.box} onPress={ViewFollowing}>
                                <Text style={{fontFamily:"Poppins-Bold"}}>{profileUser.following && profileUser.following.length  ? profileUser.following.length : 0}</Text>
                                <Text style={{fontFamily:"Poppins-Regular"}}>Following</Text>
                                <View style={styles.line}></View>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.box} onPress={ViewFollowers}>
                                <Text style={{fontFamily:"Poppins-Bold"}}>{profileUser.followers && profileUser.followers.length ? profileUser.followers.length : 0}</Text>
                                <Text style={{fontFamily:"Poppins-Regular"}}>Followers</Text>
                                <View style={styles.line}></View>
                            </TouchableOpacity>
                            <View style={styles.box}>
                                <Text style={{fontFamily:"Poppins-Bold"}}>2</Text>
                                <Text style={{fontFamily:"Poppins-Regular"}}>Posts</Text>
                            </View>

          </View>
        </View>
        <View style={styles.buttons}>
          {isFollowing.length>0?
            <TouchableOpacity style={styles.button} onPress={HandleUnfollowUser}>
              <Text style={{fontFamily:"Poppins-Bold",color:"#fff",textAlign:"center",fontSize:14}}>UnFollow</Text>
            </TouchableOpacity>
              :          
            <TouchableOpacity style={styles.button} onPress={HandleFollowUser}>
              <Text style={{fontFamily:"Poppins-Bold",color:"#fff",textAlign:"center",fontSize:14}}>Follow</Text>
            </TouchableOpacity>
          }
          <TouchableOpacity style={[styles.button,{backgroundColor:"#f3f3f3f3"}]} onPress={() => router.push({pathname:`chatRoom/${id}`})}>
            <Text style={{fontFamily:"Poppins-Bold",color:Colors.light.text,textAlign:"center",fontSize:14}}>Message</Text>
          </TouchableOpacity>

        </View>
        <ProfileTabs selectedIndex={selectedIndex} TabClick={TabClick} position={position}/>
        <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        onMomentumScrollEnd={(event)=>{
          const index = Math.round(event.nativeEvent.contentOffset.x/SCREEN_WIDTH)
          setSelectedIndex(index)
          setTimeout(() =>{
            position.value=40
          },300)
        }}
        >
                      <View style={{ width: SCREEN_WIDTH}}>
                        <FlatList data={postImages} numColumns={3} keyExtractor={(item) => item._id} renderItem={({item}) =>{
                            const userId = item.creator[0].creator_id
                            const isImage = item.image
                            return(
                              <View>
                              
                              {isImage ?
                                  <TouchableOpacity onPress={() => router.push({pathname:`/post/${userId}`,params:{userId}})}>
                                      <Image source={{ uri: item.image }} style={styles.postLayout} />
                                  </TouchableOpacity>
                                  :
                                  <TouchableOpacity>
                                      <Video source={{ uri: item.video }} style={[styles.postLayout]} resizeMode={ResizeMode.COVER} />
                                  </TouchableOpacity>
                              }
                              </View>
                            )
                        }}/>
                      </View>
                      <View style={{ width:SCREEN_WIDTH}}>
                        <FlatList data={postVideo} numColumns={3} keyExtractor={(item) => item._id} renderItem={({item}) =>{
                            const userId = item.creator[0].creator_id
                            const isImage = item.image
                            return(
                              <View>
                              
                              {isImage ?
                                  <TouchableOpacity onPress={() => router.push({pathname:`/post/${userId}`,params:{userId}})}>
                                      <Image source={{ uri: item.image }} style={styles.postLayout} />
                                  </TouchableOpacity>
                                  :
                                  <TouchableOpacity>
                                      <Video source={{ uri: item.video }} style={[styles.postLayout]} resizeMode={ResizeMode.COVER} />
                                  </TouchableOpacity>
                              }
                              </View>
                            )
                        }}/>

                      </View>
                      <View style={{ flexDirection: "row", width: SCREEN_WIDTH, flexWrap: "wrap" }}>
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
      <GestureDetector gesture={gesture}>
              <Animated.View style={[styles.bottomSheet,animateBottomSheet]}>
                        <View style={{width:30,borderRadius:20,height:3,backgroundColor:"#ccc",alignSelf:"center",marginTop:20}}></View>
                        <View style={styles.bottomSheetLayout}>
                          <View style={styles.textWrap}>
                            <Text style={styles.bottomSheetText}>Report</Text>
                          </View>
                          <View style={styles.textWrap}>
                            <Text style={styles.bottomSheetText}>Block</Text>
                          </View>
                          <View style={styles.textWrap}>
                            <Text style={styles.bottomSheetText}>Profile Activity</Text>
                          </View>
                          <View style={styles.textWrap}>
                            <Text style={styles.bottomSheetText}>Save Profile</Text>
                          </View>
                          <View style={styles.textWrap}>
                            <Text style={styles.bottomSheetText}>Enable Notifications From This Account</Text>
                          </View>
                        </View>
              </Animated.View>
      </GestureDetector>
    </View>
  )
}

export default Page


const styles = StyleSheet.create({
  container : {
    paddingTop:30,
    // paddingHorizontal:30,
    backgroundColor:"#fff",
    height:"100%",
    position:"relative"
  },

  box:{
    width:100,
    borderColor:"#ccc",
    margin:5,
    padding:5,
    borderRadius:10,
    textAlign:"center",
    justifyContent:"center",
    alignItems:"center",
    position:"relative",

  },
  line:{
    position:"absolute",
    right:-10,
    backgroundColor:"#000",
    width:1,
    height:20
  }, 
  boxLayout:{
    flexDirection:"row",
    marginVertical:-5
  },
  postLayout: {
      width: Dimensions.get('window').width / 3,
      height: 200
  },
  buttons:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center",
    marginTop:10,
    marginBottom:20
  },
  button:{
    backgroundColor:Colors.light.text,
    borderRadius:5,
    paddingHorizontal:25,
    paddingVertical:10,
    width:150,
    height:47,
    alignItems:"center",
    justifyContent:"center",
    marginHorizontal:5
  },
  bottomSheet:{
    position:"absolute",
    backgroundColor:"#fff",
    bottom:-100,
    width:Dimensions.get('window').width,
    alignSelf:"center",
    borderRadius:20,
    height:Dimensions.get('window').height/1.8
  },
  bottomSheetLayout:{
    paddingHorizontal:20,
    paddingVertical:10
  },
  bottomSheetText:{
    fontFamily:"Poppins-Light",
    fontSize:15
  },
  textWrap:{
    marginVertical:6
  }
})
