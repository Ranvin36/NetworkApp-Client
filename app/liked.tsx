import { StyleSheet, View , Text , Image, FlatList, TouchableOpacity} from "react-native"
import Stories from "@/dummyData/stories"
import { useEffect, useState,useMemo} from "react"
import axios, { Axios } from "axios"
import { ipAddress } from "@/constants/ipAddress"
import { useSelector } from "react-redux"
import { rootStore } from "./redux/store"
import { router } from "expo-router"
import { Skeleton } from "moti/skeleton"

function Liked() {
    const SkeletonCommonProps = {
        colorMode: 'light',
        transition: {
          type: 'timing',
          duration: 1500,
        },
        backgroundColor: '#D4D4D4',
      } as const;

      
      const contactsPlaceholderList = useMemo(() => {
        return Array.from({ length: 15 }).map(_ => null);
      }, []);

    const user = useSelector((state:rootStore) => state.user.user)
    const [likedPosts,setLikePosts] = useState([])
    const [loading,setLoading] = useState(true)
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
        await new Promise(resolve => setTimeout(resolve,1000))
        setLoading(false)

    }
    

    useEffect(() => {
        GetLikedPosts()
    },[])

    return(
        <View style={styles.container}>
            <Text style={{fontFamily:"Poppins-Bold",fontSize:25}}>Favourites</Text>
            <View style={styles.containerLayout}>
                <FlatList data={loading ? contactsPlaceholderList : likedPosts}  renderItem={({item}) =>{
                        return(
                        <TouchableOpacity style={styles.favouritesLayout} onPress={() => router.push("/profileLike")}>
                            <Skeleton.Group show={loading}>
                                <View style={styles.flexElements}>
                                    <Skeleton radius="round" colorMode="light" {...SkeletonCommonProps}>
                                            <Image source={{uri:item?.creator?.[0]?.profilePicture}} style={{width:55,height:55,borderRadius:50}}/>
                                        
                                    </Skeleton>
                                    <View style={{marginHorizontal:5}}>
                                        <View style={{marginBottom:5}}>
                                        <Skeleton height={25} colorMode="light" width={"80%"} {...SkeletonCommonProps}>
                                            
                                            
                                                <Text style={{fontFamily:"Poppins-Bold"}}>{item?.creator?.[0]?.username || 'Loading'}</Text>
                                        </Skeleton>
                                        </View>

                                        <Skeleton height={25} colorMode="light" width={'70%'} {...SkeletonCommonProps}>
                                            
                                                <Text style={{fontFamily:"Poppins-Regular",marginTop:-5}}>{item?.text|| 'Loading'}</Text>
                                            
                                        </Skeleton>
                                    </View>
                                </View>
                                <View style={{marginLeft:20}}>
                                    <Text style={{fontFamily:"Poppins-Light"}}>Tue. 15:30</Text>
                                </View>
                            </Skeleton.Group>
                        </TouchableOpacity>
                        )
                }}/>

            </View>
        </View>
    )
}


export default Liked

const styles = StyleSheet.create({
    container:{
        paddingVertical:40,
        paddingHorizontal:30,
        marginTop:10
    },
    containerLayout:{
        marginVertical:20
    },
    favouritesLayout:{
        flexDirection:"row",
        alignItems:"center",
        marginVertical:8,
        justifyContent:"space-between"
    },
    flexElements:{
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center"
    }
})