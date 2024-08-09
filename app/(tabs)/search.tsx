import { View , Text, StyleSheet, TextInput , Image, FlatList,TouchableOpacity, Dimensions, KeyboardAvoidingView , Platform , ScrollView} from "react-native";
import { Colors } from "@/constants/Colors";
import { AntDesign } from '@expo/vector-icons';
import search from "../../dummyData/search"
import { useEffect, useState } from "react";
import axios from "axios";
import { ipAddress } from "@/constants/ipAddress";
import { useSelector } from "react-redux";
import { rootStore } from "../redux/store";
import { router } from "expo-router";
import Animated,{ useAnimatedStyle,withTiming } from "react-native-reanimated";

export default function Page(){
    const {width:SCREEN_WIDTH,height:SCREEN_HEIGHT} = Dimensions.get('window')
    const itemWidth = SCREEN_WIDTH-40
    const user = useSelector((state:rootStore) => state.user.user)
    const [searchText,setSearchText] = useState("")
    const [searchUsers,setSearchUsers] =  useState([])
    const [selectedOption,setSelectedOption] = useState(0)
    const tabs = ['All','People','Posts','Snaps','Reels']
    function ChangeText(text){ 
        setSearchText(text)
    }

    async function GetSearchResults(){
        const data = {"name":searchText}
        console.log(data)
        const response = await axios.post(`http://${ipAddress}:3001/users/search-user`,data,{
            headers:{
                Authorization: `Bearer ${user.token}`
            }
        })
        setSearchUsers(response.data.data)
    }

    async function ViewProfile(id){
        console.log(id)
        router.push({pathname:`viewProfile/${id}` , params:{id}})
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
                <TextInput placeholder="Search A Friend" style={{borderWidth:0,fontFamily:'Poppins-Light',paddingVertical:10}} onChangeText={(e) => ChangeText(e)}/>
            </View>


            {searchText.length>0 ? 
                <View style={styles.tabContent}>
                    <View style={{flexDirection:"row",marginLeft:-10,marginVertical:20,position:"relative",paddingHorizontal:20}}>
                        <Animated.View style={[{width:200/tabs.length,backgroundColor:Colors.light.text,height:3,borderRadius:10,position:"absolute",bottom:-5},lineStyles]}></Animated.View>
                        {tabs && tabs.map((item,index) =>{
                            return(
                                <TouchableOpacity key={index} style={{width:itemWidth/tabs.length,justifyContent:"center",alignItems:"center"}} onPress={() =>setSelectedOption(index)}>
                                    <Text style={{fontFamily:"Poppins-Light"}}>{item}</Text>
                                </TouchableOpacity>
                            )
                        })}

                    </View>
                    <View>
                        <ScrollView
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
                                            {item.profilePicture ?
                                                <View>
                                                    <Image source={{uri:item.profilePicture}} style={{width:50,height:50,borderRadius:50}}/>
                                                </View>
                                                :
                                                <View>
                                                    <Image source={require("../../assets/images/user.jpg")} style={{width:50,height:50,borderRadius:50}}/>
                                                </View>
                                            }
                                            <View style={{marginHorizontal:10}}>
                                                <Text style={{fontFamily:"Poppins-Light"}}>{item.username}</Text>
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
                                            {item.profilePicture ?
                                                <View>
                                                    <Image source={{uri:item.profilePicture}} style={{width:50,height:50,borderRadius:50}}/>
                                                </View>
                                                :
                                                <View>
                                                    <Image source={require("../../assets/images/user.jpg")} style={{width:50,height:50,borderRadius:50}}/>
                                                </View>
                                            }
                                            <View style={{marginHorizontal:10}}>
                                                <Text style={{fontFamily:"Poppins-Light"}}>{item.username}</Text>
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
                                            {item.profilePicture ?
                                                <View>
                                                    <Image source={{uri:item.profilePicture}} style={{width:50,height:50,borderRadius:50}}/>
                                                </View>
                                                :
                                                <View>
                                                    <Image source={require("../../assets/images/user.jpg")} style={{width:50,height:50,borderRadius:50}}/>
                                                </View>
                                            }
                                            <View style={{marginHorizontal:10}}>
                                                <Text style={{fontFamily:"Poppins-Light"}}>{item.username}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                }}/>
                            </View>

                        </ScrollView>
                    </View>
                </View>

                        :

                        <>                        
                        <View style={styles.popularSearch}>
                                <Text style={{fontFamily:"Poppins-Bold",fontSize:17}}>Trending Search</Text>
                            {search.map((item,index)=>{
                                return(
                                    <View style={styles.searchText} key={index}>
                                            <AntDesign name="search1" size={22} color="black" />           
                                            <Text style={{fontFamily:"Poppins-Regular",marginLeft:13}}>{item.text}</Text>
                                    </View>
                                )
                            })}
                            </View>
                        <View style={styles.popularSearch}>
                                <Text style={{fontFamily:"Poppins-Bold",fontSize:17}}>People You May Know</Text>
                            {search.slice(0,4).map((item,index)=>{
                                return(
                                    <View style={[{alignItems:"center"},styles.searchText]} key={index}>
                                            <Image source={require("../../assets/images/model.jpg")} style={{width:50,height:50,borderRadius:5}}/>   
                                            <Text style={{fontFamily:"Poppins-Regular",marginLeft:13}}>Ranvin Wickramasinghe</Text>
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
        backgroundColor:"#fff",
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
        justifyContent:"center",
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

    contentLayout:{
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height,
        paddingHorizontal:25
    }
})