import { FlatList, StyleSheet, View } from "react-native"
import { ColorPalatte } from "@/constants/Colors"
import PageHeader from "@/components/pageHeader"
import ActivitySummary from "@/components/activityLayout"
import axios from "axios"
import { ipAddress } from "@/constants/ipAddress"
import { useSelector } from "react-redux"
import { rootStore } from "./redux/store"
import { useEffect, useState } from "react"
const Colors = ColorPalatte()

const Saved:React.FC = () =>{
    const user = useSelector((state:rootStore) => state.user.user)
    const [bookmarks,setBookmarks] = useState([])
    async function GetBookmarkedPosts(){
        const response = await axios.get(`http://${ipAddress}:3001/users/bookmarks`,{
            headers:{
                Authorization : `Bearer ${user?.token}`
            }
        })

        setBookmarks(response.data.data)
    }

    useEffect(() => {
        GetBookmarkedPosts()
    },[])

    console.log(bookmarks)

    return(
        <View style={styles.container}>
            <PageHeader text="Saved"/>
            <View style={styles.savedContent}>
                <FlatList data={bookmarks} renderItem={({item}) =>{
                    return(
                        <ActivitySummary item={item}/>
                    )
                }}/>
            </View> 
        </View>
    )
}


export default Saved


const styles = StyleSheet.create({
    container:{
        paddingHorizontal:20,
        backgroundColor:Colors.theme.backgroundColor,
        height:"100%"
    },
    savedContent:{
        paddingTop:15
    }
})