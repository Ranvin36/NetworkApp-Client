import { View,Text, TextInput,StyleSheet,TouchableOpacity, Alert, ToastAndroid } from "react-native"
import { StatusBar } from "expo-status-bar"
import { Link, useRouter } from "expo-router"
import TextInputLayout from "@/components/TextInput"
import { Ionicons } from '@expo/vector-icons';
import { useState } from "react"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./redux/userSlice";
import { setOtp } from "./redux/otpSlice";
import { rootStore } from "./redux/store";
import { ipAddress } from "@/constants/ipAddress";
import * as SMS from 'expo-sms';
import { MaterialCommunityIcons,AntDesign } from '@expo/vector-icons';
import TouchButton from "@/components/touchButton";
import { ColorPalatte } from "@/constants/Colors";
const Colors = ColorPalatte()

function Login(){
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [receivedOtp,setReceivedOtp] = useState([])
    const [secretField, setSecretField] = useState(true)
    const [loading, setLoading] = useState(false)
    const selector = useSelector((state:rootStore)=>state.user)
    const dispatch = useDispatch()
    const router = useRouter()
    async function SetOtp(token:string){
        const data = {"phoneNum":94767544717}
        const response = await axios.post(`http://${ipAddress}:3001/users/send-otp`,data,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        dispatch(setOtp(response.data))
        router.push("/otpAuth")
    }
    async function LoginBtn(){
        try{
            setLoading(true)
            dispatch(setUser({}))
            const data={email,password}
            const response = await axios.post(`http://${ipAddress}:3001/users/login`,data)
            dispatch(setUser(response.data))
            SetOtp(response.data.token)
            setLoading(false)
            console.log("DONE")
        }
        catch(error){
            console.log(error)
            setLoading(false)
            ToastAndroid.show("Invalid Credentials",ToastAndroid.SHORT)
        }
    }

    function eyeToggle(){
        setSecretField((prev) => !prev)
    }

    return(
        <View style={styles.loginContainer}>
            <View>
                <Text style={[styles.textColor,{fontFamily:"Poppins-Bold" , fontSize:35}]}>Hey,</Text>
                <Text style={[styles.textColor,{fontFamily:"Poppins-Bold" , fontSize:33}]}>Welcome Back</Text>
            </View>
            <View style={{marginTop:20}}>
                <Link href='/home'>
                    <Text style={[styles.textColor,{fontFamily:"Poppins-Light"}]}>Please Login To Continue</Text>
                </Link>
                <View style={styles.textInputs}>
                    <TextInputLayout placeholder="Enter Your Email" onChange={setEmail} icon="email-outline"/>
                    <View style={[styles.fieldContainer,{position:'relative'}]}>
                        <AntDesign name="lock" size={22} color={Colors.theme.fontColor}  style={{marginBottom:3}}/>
                        <TextInput  placeholder="Enter Your Password"  style={[styles.textColor,{fontFamily:"Poppins-Light",width:"100%",marginLeft:5}]} placeholderTextColor={Colors.theme.fontColor} secureTextEntry={secretField} onChangeText={(e) => setPassword(e)}/>
                        {secretField ? 
                            <TouchableOpacity style={styles.eyeContainer}  onPress={eyeToggle}>
                                <Ionicons name="eye-off" size={24} color={Colors.theme.fontColor} />
                            </TouchableOpacity>
                                                            :
                            <TouchableOpacity style={styles.eyeContainer}  onPress={eyeToggle}>
                                <Ionicons name="eye" size={24} color={Colors.theme.fontColor} />
                            </TouchableOpacity>
                    }
                    </View>

                </View>
            </View>
            <Link href="/forgotPassword" style={{marginHorizontal:5,marginVertical:2}}>
                <Text style={[styles.textColor,{fontFamily:"Poppins-Regular"}]}>Forgot Password?</Text>
            </Link>
            <View>
                {/* <TouchableOpacity style={styles.loginBtn} onPress={LoginBtn}>
                    <Text style={{fontFamily:"Poppins-Bold",color:"#fff",fontSize:15}}>Login</Text>
                </TouchableOpacity> */}

                <TouchButton text="Login" onPress={LoginBtn} loading={loading}/>
                <View style={{marginVertical:20}}>
                    <Text style={[styles.textColor,{fontFamily:"Poppins-Light",textAlign:'center'}]}>Don't Have An Account? <Text style={{color:Colors.light.text,fontFamily:"Poppins-Bold"}}>Sign Up</Text></Text>
                </View>
            </View>
        </View>
    )
}

export default Login

const styles = StyleSheet.create({
    loginContainer:{
        paddingVertical:100,
        paddingHorizontal:30,
        backgroundColor:Colors.theme.backgroundColor,
        height:"100%"
    },
    textInputs:{marginVertical:15},
    inputFields:{
        color:'#fff',
        fontFamily:'Poppins-Bold'
    },
    fieldContainer:{
        borderWidth:1,
        padding:13,
        flexDirection:"row",
        alignItems:"center",
        borderRadius:10,
        marginVertical:5,
        borderColor:Colors.theme.fontColor
    },
    loginBtn:{
        backgroundColor:Colors.light.text,
        paddingVertical:15,
        borderRadius:10,
        alignItems:"center",
        marginVertical:7
    },
    eyeContainer:{
        position:'absolute',
        top:"50%",
        right:20
    },
    textColor:{
        color:Colors.theme.fontColor
    }
})