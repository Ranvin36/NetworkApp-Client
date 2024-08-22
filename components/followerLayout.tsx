import { View,Image,Text } from "react-native"

function FollowerLayout({data}){

    return(
        <View style={{flexDirection:"row",alignItems:'center',marginVertical:10}}>
                  <View>
                    {data && data.length > 0 && data[0].profilePicture.length>0 && data[0].profilePicture ?
                    <Image source={{uri:data[0].profilePicture}} style={{width:50,height:50,borderRadius:50}}/>
                              :
                    <Image source={require("../assets/images/model.jpg")} style={{width:50,height:50,borderRadius:50}}/>
                  }
                  </View>
                  <View style={{marginHorizontal:5}}>
                    <Text style={{fontFamily:"Poppins-Bold"}}>{data[0].username}</Text>
                    <Text style={{fontFamily:"Poppins-Light",marginTop:-5}}>@{data[0].username}</Text>
                  </View>
               </View>
    )
}
export default FollowerLayout