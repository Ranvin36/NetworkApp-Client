import { StyleSheet, View , Text , Image, FlatList, TouchableOpacity, Dimensions} from "react-native"
import Stories from "@/dummyData/stories"
import { useEffect, useState,useMemo} from "react"
import axios, { Axios } from "axios"
import { ipAddress } from "@/constants/ipAddress"
import { useSelector } from "react-redux"
import { rootStore } from "./redux/store"
import { router } from "expo-router"
import { Skeleton } from "moti/skeleton"
import { ColorPalatte } from "@/constants/Colors";
import PageHeader from "@/components/pageHeader"
import moment from "moment"
const Colors = ColorPalatte()

type ItemTypes={
    username:string,
    profilePicture:string,
    
}

type LikedTypes ={
    creator:ItemTypes[],
    text:string,
    createdAt: Date,
    updatedAt: Date,
}

const {width:SCREEN_WIDTH, height:SCREEN_HEIGHT} = Dimensions.get('window')

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
        setLoading(true)
        const posts = await axios.post(`http://${ipAddress}:3001/posts/liked`,null,{
            headers:{
                Authorization:`Bearer ${user?.token}`
            }
        })
        setLikePosts(posts.data.data)
        setLoading(false)
    }
    
    useEffect(() => {
        GetLikedPosts()
    },[])
    return(
        <View style={styles.container}>
            <PageHeader text="Liked"/>
            <View style={styles.containerLayout}>
                <FlatList<LikedTypes> data={likedPosts}  renderItem={({item}) =>{
                    const dateTime = moment(item.updatedAt).format("dd h:mm a")
                        return(
                        <TouchableOpacity style={styles.favouritesLayout} onPress={() => router.push("/profileLike")}>
                                <View style={styles.flexElements}>
                                    <Skeleton radius="round" colorMode="light" width={50} height={50}>
                                        {loading ? null : <Image source={{uri:item?.creator?.[0]?.profilePicture}} style={{width:55,height:55,borderRadius:50}}/>}                                        
                                    </Skeleton>
                                    <View style={{marginHorizontal:5}}>
                                        <View style={{marginBottom:5}}>
                                        <Skeleton height={25} colorMode="light" width={"50%"}>
                                            {loading ? null : <Text style={[styles.textColor,{fontFamily:"Poppins-Bold"}]}>{item?.creator?.[0]?.username || 'Loading'}</Text>}
                                            
                                        </Skeleton>
                                        </View>

                                        <Skeleton height={25} colorMode="light" width={'50%'}>
                                            {loading ? null : <Text style={[styles.textColor,{fontFamily:"Poppins-Regular",marginTop:-5}]}>{item?.text|| 'Loading'}</Text>    }
                                        
                                        </Skeleton>
                                    </View>
                                </View>
                                <View>
                                    <Text style={{fontFamily:"Poppins-Light"}}>{dateTime}</Text>
                                </View>
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
        paddingVertical:10,
        paddingHorizontal:20,
        height:"100%",
        backgroundColor:Colors.theme.backgroundColor,
    },
    containerLayout:{
        marginVertical:10
    },
    favouritesLayout:{
        flexDirection:"row",
        alignItems:"center",
        marginVertical:8,
        justifyContent:"space-between"
    },
    flexElements:{
        flexDirection:"row",
        alignItems:"center"
    },
    textColor:{
        color:Colors.theme.fontColor
    }
})