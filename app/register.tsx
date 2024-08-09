import { View,Text, TextInput,StyleSheet,TouchableOpacity } from "react-native"
import { StatusBar } from "expo-status-bar"
import { Link, router } from "expo-router"
import TextInputLayout from "@/components/TextInput"
import { useState } from "react"
import axios from "axios"
import { ipAddress } from "@/constants/ipAddress"
import { MaterialCommunityIcons,AntDesign,Ionicons } from '@expo/vector-icons';
import { Colors } from "@/constants/Colors"

function Register(){
    const [username,setUsername] = useState('')
    const [email,setEmail] = useState('')
    const [secretField,setSecretField] = useState(true)
    const [password,setPassword] = useState('')
    async function RegisterBtn(){
        console.log("Inside")
        try{
            const data={username,email,password}
            const response = await axios.post(`http://${ipAddress}:3001/users/register`,data)
            console.log(response)
            router.push("/login")
        }
        catch(error){
            console.log(error)
        }
    }

    function eyeToggle(){
        setSecretField((prev) =>!prev)
    }


    return(
        // <View style={styles.loginContainer}>
        //     <StatusBar style="light"/>
        //     <View style={styles.detailsContainer}>
        //         <Text style={{
        //             color:"#d92b68",
        //             fontFamily:"Poppins-Bold",
        //             fontSize:30
        //         }}>REGISTER</Text>
        //         <TextInputLayout placeholder="Username"   onChange={setUsername} />
        //         <TextInputLayout placeholder="Email Address" onChange={setEmail}/>
        //         <TextInputLayout placeholder="Password"  onChange={setPassword}/>
        //         {/* <View style={styles.fieldContainer}>
        //             <TextInput style={{fontFamily:'Poppins-Light',color:'#fff'}}  placeholder="Password" placeholderTextColor="#fff"/>
        //         </View> */}
        //         <View style={{marginVertical:10}}>
        //             <Link href='/login'  style={{fontFamily:'Poppins-Light',color:'#333'}}>Already Have An Account? Login</Link>
        //         </View>
        //         <TouchableOpacity style={styles.loginBtn} onPress={RegisterBtn}>
        //             <Text style={{fontFamily:'Poppins-Light',color:"#fff"}}>Register</Text>
        //         </TouchableOpacity>
        //     </View>
        // </View>
        <View style={styles.loginContainer}>
        <View>
            <Text style={{fontFamily:"Poppins-Bold" , fontSize:35}}>Let's,</Text>
            <Text style={{fontFamily:"Poppins-Bold" , fontSize:33}}>Get Started</Text>
        </View>
        <View style={{marginTop:20}}>
            <View>
                <Text style={{fontFamily:"Poppins-Light"}}>Create Your Account</Text>
            </View>
            <View style={styles.textInputs}>
                <TextInputLayout placeholder="Enter Your Username" onChange={setUsername} icon="face-man-outline"/>
                <TextInputLayout placeholder="Enter Your Email" onChange={setEmail} icon="email-outline"/>
                
                <View style={[styles.fieldContainer,{position:"relative"}]}>
                    <AntDesign name="lock" size={22} color="black"  style={{marginBottom:3}}/>
                    <TextInput  placeholder="Enter Your Password"  style={{fontFamily:"Poppins-Light",width:"100%",marginLeft:5}} onChangeText={(e) => setPassword(e)} secureTextEntry={secretField}/>
                    {secretField ?
                        <TouchableOpacity style={styles.eyeContainer}  onPress={eyeToggle}>
                            <Ionicons name="eye-off" size={24} color="black" />
                        </TouchableOpacity>
                                                :
                    <TouchableOpacity style={styles.eyeContainer}  onPress={eyeToggle}>
                        <Ionicons name="eye" size={24} color="black" />
                    </TouchableOpacity>
                    }
                </View>
            </View>
        </View>

        <View>
            <TouchableOpacity style={styles.loginBtn} onPress={RegisterBtn}>
                <Text style={{fontFamily:"Poppins-Bold",color:"#fff",fontSize:15}}>Sign Up</Text>
            </TouchableOpacity>
            <View style={{marginVertical:20}}>
                <Text style={{fontFamily:"Poppins-Light",textAlign:'center'}}>Already Have An Account? <Text style={{color:Colors.light.text,fontFamily:"Poppins-Bold"}}>Sign In</Text></Text>
            </View>
        </View>
    </View>
    )
}

export default Register

const styles = StyleSheet.create({
    loginContainer:{
        paddingVertical:70,
        paddingHorizontal:30,
        marginTop:30
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
        marginVertical:5
    },
    loginBtn:{
        backgroundColor:Colors.light.text,
        paddingVertical:15,
        borderRadius:10,
        alignItems:"center",
        marginVertical:7
    }, eyeContainer:{
        position:'absolute',
        top:"50%",
        right:20
    }
    
})