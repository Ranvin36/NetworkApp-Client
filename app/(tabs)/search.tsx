import { View , Text, StyleSheet, TextInput , Image, FlatList,TouchableOpacity, Dimensions, KeyboardAvoidingView , Platform , ScrollView} from "react-native";
import { AntDesign } from '@expo/vector-icons';
import search from "../../dummyData/search"
import { useEffect, useState,useRef} from "react";
import axios from "axios";
import { ipAddress } from "@/constants/ipAddress";
import { useSelector } from "react-redux";
import { rootStore } from "../redux/store";
import { router } from "expo-router";
import Animated,{ useAnimatedStyle,withTiming,scrollTo} from "react-native-reanimated";
import SearchPosts from "@/components/searchPosts";
import  {Skeleton} from "moti/skeleton"
import { ColorPalatte } from "@/constants/Colors";
import SearchClips from "@/components/searchClips";
const Colors = ColorPalatte()

export default function Page(){
    const {width:SCREEN_WIDTH,height:SCREEN_HEIGHT} = Dimensions.get('window')
    const itemWidth = SCREEN_WIDTH-40
    const user = useSelector((state:rootStore) => state.user.user)
    const [loading,setLoading] = useState(true)
    const [searchText,setSearchText] = useState("")
    const [searchUsers,setSearchUsers] =  useState([])
    const [selectedOption,setSelectedOption] = useState(0)
    const tabs = ['All','People','Posts','Snaps','Reels']
    const scrollRef = useRef<ScrollView>(null)
    function ChangeText(text:string){ 
        setSearchText(text)
    }

    async function GetSearchResults(){
        setLoading(true)
        const data = {"name":searchText}
        const response = await axios.post(`http://${ipAddress}:3001/users/search-user`,data,{
            headers:{
                Authorization: `Bearer ${user?.token}`
            }
        })
        setSearchUsers(response.data.data)
        setLoading(false)
    }

    async function ViewProfile(id:number){
        console.log(id)
        router.push({pathname:`viewProfile/${id}` , params:{id}})
    }

    function TabClick(index:number){
        setSelectedOption(index)
        scrollRef?.current?.scrollTo({
            x:SCREEN_WIDTH* index
        })
    }

    const lineStyles = useAnimatedStyle(() =>{
        return {
            left: withTiming(itemWidth/tabs.length * selectedOption +32 ,{duration:300})
        } 
    },[selectedOption])
    

    useEffect(() => {
        GetSearchResults()
    },[searchText])

    useEffect(() =>{
        setSelectedOption(0)
    },[])
    return(
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={styles.search}>
                <TextInput placeholder="Search A Friend" placeholderTextColor={Colors.theme.fontColor} value={searchText} style={[styles.textColor,{borderWidth:0,fontFamily:'Poppins-Light',paddingVertical:10,minWidth:150}]} onChangeText={(e) => ChangeText(e)}/>
                {searchText.length>0 && 
                <TouchableOpacity onPress={() =>setSearchText('')}>
                    <AntDesign name="closecircleo" size={22} color={Colors.theme.fontColor} />
                </TouchableOpacity>}
            </View>


            {searchText.length>0 ? 
                <View style={styles.tabContent}>
                    <View style={{flexDirection:"row",marginLeft:-10,marginVertical:20,position:"relative",paddingHorizontal:20}}>
                        <Animated.View style={[{width:200/tabs.length,backgroundColor:Colors.light.text,height:3,borderRadius:10,position:"absolute",bottom:-5},lineStyles]}></Animated.View>
                        {tabs && tabs.map((item,index) =>{
                            return(
                                <TouchableOpacity key={index} style={{width:itemWidth/tabs.length,justifyContent:"center",alignItems:"center"}} onPress={() =>TabClick(index)}>
                                    <Text style={[styles.textColor,{fontFamily:"Poppins-Light"}]}>{item}</Text>
                                </TouchableOpacity>
                            )
                        })}

                    </View>
                    <View>
                        <ScrollView
                        ref={scrollRef}
                        horizontal
                        pagingEnabled
                        scrollEventThrottle={16}
                        onMomentumScrollEnd={(event) =>{
                            const index = event.nativeEvent.contentOffset.x / (SCREEN_WIDTH)
                            setSelectedOption(index)
                        }}
                        >
                            <View style={styles.contentLayout}>
                                <FlatList data={searchUsers} renderItem={({item}) =>{
                                    // console.log(item)
                                    return(
                                        <TouchableOpacity style={styles.tabLayout} onPress={() =>ViewProfile(item._id)}>
                                            <Skeleton colorMode="light" width={50} height={50} radius='round'>
                                                {loading ? null :                                                
                                                    item.profilePicture ?
                                                        <View>
                                                            <Image source={{uri:item.profilePicture}} style={{width:50,height:50,borderRadius:50}}/>
                                                        </View>
                                                        :
                                                        <View>
                                                            <Image source={require("../../assets/images/user.jpg")} style={{width:50,height:50,borderRadius:50}}/>
                                                        </View>
                                                    
                                            }
                                            </Skeleton>
                                            <View style={{marginHorizontal:10}}>
                                                <Skeleton colorMode="light" height={20} width={150}>
                                                    {loading ? null :
                                                    <Text style={[styles.textColor,{fontFamily:"Poppins-Light"}]}>{item.username}</Text>
                                                    }
                                                </Skeleton>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                }}/>
                            </View>
                            <View style={styles.contentLayout}>
                                <FlatList data={searchUsers} renderItem={({item}) =>{
                                    // console.log(item)
                                    return(
                                        <TouchableOpacity style={styles.tabLayout} onPress={() =>ViewProfile(item._id)}>
                                            <Skeleton colorMode="light" width={50} height={50} radius='round'>
                                                {loading ? null :
                                                
                                                    item.profilePicture ?
                                                        <View>
                                                            <Image source={{uri:item.profilePicture}} style={{width:50,height:50,borderRadius:50}}/>
                                                        </View>
                                                        :
                                                        <View>
                                                            <Image source={require("../../assets/images/user.jpg")} style={{width:50,height:50,borderRadius:50}}/>
                                                        </View>
                                                    
                                                }
                                            </Skeleton>
                                            <View style={{marginHorizontal:10}}>
                                                <Skeleton colorMode="light"  height={20} width={150}>
                                                    {loading ? null :
                                                    <Text style={[styles.textColor,{fontFamily:"Poppins-Light"}]}>{item.username}</Text>
                                                    }
                                                </Skeleton>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                }}/>
                            </View>
                            <View style={[styles.contentLayout,{paddingHorizontal:0}]}>
                          
                                <SearchPosts searchParam={searchText}/>
                                
                            </View>
                            <View style={styles.contentLayout}>
                                <FlatList data={searchUsers} renderItem={({item}) =>{
                                    // console.log(item)
                                    return(
                                        <TouchableOpacity style={styles.tabLayout} onPress={() =>ViewProfile(item._id)}>
                                            <Skeleton colorMode="light" width={50} height={50} radius='round'>
                                                {loading ? null :
                                                
                                                    item.profilePicture ?
                                                        <View>
                                                            <Image source={{uri:item.profilePicture}} style={{width:50,height:50,borderRadius:50}}/>
                                                        </View>
                                                        :
                                                        <View>
                                                            <Image source={require("../../assets/images/user.jpg")} style={{width:50,height:50,borderRadius:50}}/>
                                                        </View>
                                                    
                                                }
                                            </Skeleton>
                                            <View style={{marginHorizontal:10}}>
                                                <Skeleton colorMode="light"  height={20} width={150}>
                                                    {loading ? null :
                                                    <Text style={[styles.textColor,{fontFamily:"Poppins-Light"}]}>{item.username}</Text>
                                                    }
                                                </Skeleton>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                }}/>
                            </View>
                            <View style={[styles.contentLayout,{paddingHorizontal:20}]}>
                                <SearchClips/>
                            </View>

                        </ScrollView>
                    </View>
                </View>

                        :

                        <>                        
                        <View style={styles.popularSearch}>
                                <Text style={[styles.textColor,{fontFamily:"Poppins-Bold",fontSize:17}]}>Trending Search</Text>
                            {search.map((item,index)=>{
                                return(
                                    <View style={styles.searchText} key={index}>
                                            <AntDesign name="search1" size={22} color={Colors.theme.fontColor} />           
                                            <Text style={[styles.textColor,{fontFamily:"Poppins-Regular",marginLeft:13}]}>{item.text}</Text>
                                    </View>
                                )
                            })}
                            </View>
                        <View style={styles.popularSearch}>
                                <Text style={[styles.textColor,{fontFamily:"Poppins-Bold",fontSize:17}]}>People You May Know</Text>
                            {search.slice(0,4).map((item,index)=>{
                                return(
                                    <View style={[{alignItems:"center"},styles.searchText]} key={index}>
                                            <Image source={require("../../assets/images/model.jpg")} style={{width:50,height:50,borderRadius:5}}/>   
                                            <Text style={[styles.textColor,{fontFamily:"Poppins-Regular",marginLeft:13}]}>Ranvin Wickramasinghe</Text>
                                    </View>
                                )
                            })}
                            </View>
                        </>
            
        }
        </KeyboardAvoidingView>
    )
}


const styles = StyleSheet.create({
    container:{
        paddingVertical:55,
        width:Dimensions.get('window').width,
        backgroundColor:Colors.theme.backgroundColor,
        height:"100%"
    },
    tabLayout:{
        flexDirection:"row",
        marginVertical:10,
        alignItems:"center"
    },
    search:{
        borderWidth:1,
        borderColor:Colors.light.text,
        borderRadius:50,
        paddingHorizontal:20,
        marginHorizontal:20,
        justifyContent:"space-between",
        backgroundColor:Colors.theme.backgroundTransparent,
        flexDirection:"row",
        alignItems:"center"
    },
    popularSearch:{
        paddingHorizontal:20,
        margin:10
    },
    searchText:{
        marginVertical:10,
        flexDirection:"row",
    },
    tabContent:{
    },
    textColor:{
        color:Colors.theme.fontColor
    },
    contentLayout:{
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height,
        paddingHorizontal:25
    }
})