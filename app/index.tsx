import { Link, router } from "expo-router";
import { StyleSheet, Text, View, Image,TouchableOpacity } from "react-native";
import { ColorPalatte } from "@/constants/Colors";
const Colors = ColorPalatte()
export default function Index() {
  return (
    <View
      style={{
        alignItems: "center",

        paddingVertical:100,
        backgroundColor:Colors.theme.backgroundColor,
        height:"100%"
      }}
    >
      <View>
        <Image source={require("../assets/images/welcome.png")} style={{width:300,height:300}}/>
      </View>
      <View style={{width:300,marginVertical:10}}>
        <Text style={{fontFamily:"Poppins-Bold",fontSize:30,textAlign:"center",color:"#d92b68"}}>HELLO!</Text>
        <Text style={{fontFamily:"Poppins-Light",fontSize:17,textAlign:"center",color:"#ccc",marginTop:5}}>Welcome To FLEEXY To Manage Your Personal Needs </Text>
      </View>
      <View style={styles.buttons}>
          <TouchableOpacity style={styles.button} onPress={()=>router.push("/login")}>
             <Text style={{fontFamily:'Poppins-Bold',color:"#fff"}}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button,{backgroundColor:"transparent",borderWidth:1,borderColor:"#d92b68"}]} onPress={()=>router.push("/register")}>
             <Text style={{fontFamily:"Poppins-Bold",color:"#d92b68"}}>Sign Up</Text>
          </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textStyles:{
    color:"#000",
    fontFamily:'Poppins-Bold'
  },
  buttons:{
    flexDirection:"row",
    marginVertical:20
  },
  button:{
    backgroundColor:"#d92b68",
    width:130,
    height:50,
    padding:10,
    alignItems:'center',
    justifyContent:'center',
    marginHorizontal:5,borderRadius:50
  }
})
