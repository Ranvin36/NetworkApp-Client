import { useState } from "react"
import { StyleSheet, View,Text } from "react-native"
import TextInputLayout from "@/components/TextInput"
import BackArrow from "@/components/backArrow"
import TouchButton from "@/components/touchButton"
import axios from "axios"
import { ipAddress } from "@/constants/ipAddress"
import { useDispatch } from "react-redux"
import { setOtp } from "./redux/otpSlice"
import { router } from "expo-router"
import { setUser } from "./redux/userSlice"
import { ColorPalatte } from "@/constants/Colors";
const Colors = ColorPalatte()

function ForgotPassword(){
    const [email,setEmail] = useState("")
    const dispatch = useDispatch()
    const [loading,setLoading] = useState(false)
    async function SendOtp(){
        const data = {"email":email}
        const response  =  await axios.post(`http://${ipAddress}:3001/users/password-email`,data)
        dispatch(setOtp(response.data.data.otp))
        dispatch(setUser(response.data.findUser))
        router.push("/passwordAuth")
    }
    return(
        <View style={styles.container}>
            <BackArrow/>
               <View style={styles.texts}>
                <Text style={[styles.textColor,{fontFamily:"Poppins-Bold" , fontSize:35}]}>Forgot,</Text>
                <Text style={[styles.textColor,{fontFamily:"Poppins-Bold" , fontSize:33}]}>Your Password?</Text>
            </View>
            <View style={{marginVertical:10}}>
                <Text style={[styles.textColor,{fontFamily:"Poppins-Light"}]}>An Otp Will Be Sent To The Below Email</Text>
            </View>
            <View>
                <TextInputLayout placeholder="Enter Your Email" onChange={setEmail} icon="email-outline"/>
            </View>
            <TouchButton text="Send Otp" onPress={SendOtp} loading={loading}/>
        </View>
    )
}


export default ForgotPassword

const styles = StyleSheet.create({
    container:{
        paddingVertical:70,
        paddingHorizontal:30,
        backgroundColor:Colors.theme.backgroundColor,
        height:"100%"
    },
    texts:{
        marginTop:30,
    },
    textColor:{
        color:Colors.theme.fontColor
    }
})