import { Dimensions, FlatList, Image, StyleSheet,Text ,View} from "react-native"
import axios from "axios"
import { useEffect, useState } from "react"
import { ipAddress } from "@/constants/ipAddress"
import { useSelector } from "react-redux"
import { rootStore } from "@/app/redux/store"
import { Video,ResizeMode} from "expo-av"
import {Feather,Ionicons} from '@expo/vector-icons';

const SearchClips:React.FC = ({searchText}) =>{
    const user = useSelector((state:rootStore) => state.user.user)
    const [searchClips,setSearchClips] = useState([])
    async function GetSearchResults(){
        const response =await axios.post(`http://${ipAddress}:3001/reels/search?title=${searchText}`,null,{
            headers:{
                Authorization:`Bearer ${user?.token}`
            }
        })
        setSearchClips(response.data.findReels)
    }

    
    useEffect(()=>{
        GetSearchResults()
    },[searchText])

    return(
        <View style={styles.container}>
            <FlatList 
             data={searchClips}
             numColumns={2}
             horizontal={false}
             keyExtractor={(item)  =>item._id}
             renderItem={({item}) =>{
                return(
                    <View style={styles.clipContainer}>
                        <View style={styles.playButton}>
                            <Ionicons name="play-circle-outline" size={40} color="#fff" />
                        </View>
                        <View style={styles.viewsContainer}>
                            <Feather name="eye" size={18} color="#fff" />
                            <Text style={[styles.fontSpec,{fontSize:11,color:"#fff"}]}>1.7M</Text>
                        </View>
                        <View>
                            <Video resizeMode={ResizeMode.COVER} source={{uri:item.media}} style={styles.media}/>
                        </View>
                        <View>
                            <Text style={styles.fontSpec}>{item.text}</Text>
                        </View>
                    </View>
                )
            }}/>
        </View>
    )
}


export default SearchClips

const styles = StyleSheet.create({
    container:{
        height:"100%"
    },
    media:{
        width:Dimensions.get('window').width/2-30,
        height:300,
        borderRadius:10
    },
    clipContainer:{
        margin:5,
        position:"relative",
    },
    fontSpec:{
        fontFamily:"Poppins-Light",
        fontSize:13,
        marginLeft:5
    },
    viewsContainer:{
        position:"absolute",
        top:10,
        left:5,
        zIndex:1,
        flexDirection:"row",
        alignItems:"center",
        backgroundColor:"#00000094",
        paddingHorizontal:10,
        paddingVertical:5,
        borderRadius:20
    },
    playButton:{
        position:"absolute",
        zIndex:1,
        alignItems:"center",
        justifyContent:"center",
        top:150,
        width:Dimensions.get('window').width/2.5
    }
})