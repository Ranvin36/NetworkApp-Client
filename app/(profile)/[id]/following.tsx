import FollowerLayout from "@/components/followerLayout";
import { View,Text,StyleSheet, FlatList} from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { rootStore } from "../../redux/store";
import { ipAddress } from "@/constants/ipAddress";
import { useLocalSearchParams } from "expo-router";

export default function Page(){
        const { id } = useLocalSearchParams()
        const [followerData,setFollowerData] = useState([])
        const  user = useSelector((user:rootStore) => user.user.user)
        async function GetFollowers(){
          const response  =  await axios.get(`http://${ipAddress}:3001/users/get-followers/${id}`,{
              headers:{
                  Authorization: `Bearer ${user.token}`
              }
          })
  
          setFollowerData(response.data)
      }


      useEffect(() =>{
        GetFollowers()
      },[])


        return(
            <View style={styles.container}>
              {followerData && followerData.length > 0  ?            
                <FlatList  data={followerData} renderItem={({item}) =>{
                      return(
                        <FollowerLayout data={item.following}/>
                      )
                }}/>
                              :
                  <View style={{alignItems:"center",justifyContent:"center",height:"90%"}}>
                    <Text style={{fontFamily:"Poppins-Regular",fontSize:18}}>No Following</Text>
                  </View>
            }
            </View>
          )
}

const styles = StyleSheet.create({
  container:{
      padding:12,
      backgroundColor:"#fff",
      height:"100%"
  }
})