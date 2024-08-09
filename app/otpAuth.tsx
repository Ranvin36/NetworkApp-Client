import { View,Text, StyleSheet, TextInput,StatusBar,Image, TouchableOpacity} from "react-native"
import BackArrow from "../components/backArrow"
import { useEffect, useState } from "react"
import axios from "axios"
import { useSelector } from "react-redux"
import { rootStore } from "./redux/store"
import {router} from "expo-router"
import {ipAddress} from "../constants/ipAddress"
import OtpDigits from "@/components/otpDigits"
import TouchButton from "@/components/touchButton"

function OtpAuth(){
    const [otp,setOtp] = useState(['','','',''])
    const [validOtp,setValidOtp] = useState(true) 
    const user = useSelector((state:rootStore) => state.user.user)
    const receivedOtp = useSelector((state:rootStore) => state.otp.otp)
    function handleOtpChange(value,index){
        console.log(value)
        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)
    }
    // console.log(otp, receivedOtp.data.otp,user.token)
    console.log(user,"USER")
    async function VerifyOtp(){
        try{
            const data = {"sentOtp":receivedOtp.data.otp , "receivedOtp":otp}
            const response = await axios.post(`http://${ipAddress}:3001/users/verify-otp`,data)
            router.push("/home")
        }
        catch(error){
            console.log("error")
            setValidOtp(false)
        }

    }

    // useEffect(()=>{
    //     SetOtp()
    // },[])
    
    
    return(
        <View style={styles.container}>
            <StatusBar barStyle="dark-content"/>
            <BackArrow/>
            <View style={{marginTop:5,alignItems:"center"}}>
                <Image source={require("../assets/images/MobileBro.png")} style={{width:250,height:240}}/>
                <Text style={{textAlign:"center",fontFamily:"Poppins-Bold",fontSize:17,marginVertical:10}}>Enter Verification Code</Text>
            </View>
            <View style={{
                flexDirection:'row',
                alignItems:"center",
                justifyContent:"center"
            }}>

                {otp.map((digits,index)=>{
                    return(
                        <View key={index}>
                            <OtpDigits index={index} digits={digits} validOtp={validOtp} handleOtpChange={handleOtpChange}/>
                        </View>
                    )
                })}
            </View>
            <View style={{alignItems:"center",marginVertical:10}}>
                <Text style={{fontFamily:"Poppins-Light"}}>Resend Otp In 01:30</Text>
            </View>
            <View style={{alignItems:"center"}}>
                {!validOtp && <Text style={{fontFamily:"Poppins-Bold",color:"red"}}>Invalid Otp</Text>}
            </View>
            <TouchButton onPress={VerifyOtp} text="Login"/>
        </View>
    )
}

export default OtpAuth

const styles = StyleSheet.create({
    container:{
        paddingVertical:55,
        paddingHorizontal:25
    },
    box:{
        borderWidth:1,
        width:60,
        height:60,
        marginHorizontal:5,
        borderRadius:5,
        textAlign:"center",
        fontFamily:"Poppins-Light"
       }
})