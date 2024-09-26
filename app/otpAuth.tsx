import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    Image,
} from "react-native";
import BackArrow from "../components/backArrow";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { rootStore } from "./redux/store";
import { router } from "expo-router";
import { ipAddress } from "../constants/ipAddress";
import OtpDigits from "@/components/otpDigits";
import TouchButton from "@/components/touchButton";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ColorPalatte } from "@/constants/Colors";
import setOtp from "./redux/otpSlice";
import { AppState } from "react-native";
// Import the custom countdown or alternative component
// import CountDown from 'react-native-countdown-component'; // Remove this
import CustomCountDown from "@/components/CustomCountDown"; // Add your custom countdown

const Colors = ColorPalatte();

function OtpAuth() {
    const [otp, setOtp] = useState(['', '', '', '']);
    const [validOtp, setValidOtp] = useState(true);
    const [resendOtp, setResendOtp] = useState(false);
    const dispatch = useDispatch();
    const user = useSelector((state: rootStore) => state.user);
    const receivedOtp = useSelector((state: rootStore) => state.otp.otp);

    function handleOtpChange(value, index) {
        console.log(value);
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
    }

    async function SetOtp(token: string) {
        const data = { "phoneNum": 94767544717 };
        const response = await axios.post(`http://${ipAddress}:3001/users/send-otp`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        dispatch(setOtp(response.data));
        router.push("/otpAuth");
    }

    async function VerifyOtp() {
        try {
            const data = { "sentOtp": receivedOtp?.data.otp, "receivedOtp": otp };
            const response = await axios.post(`http://${ipAddress}:3001/users/verify-otp`, data);
            try {
                await AsyncStorage.setItem('user', JSON.stringify(user));
            }
            catch (error) {
                console.log(error);
            }
            router.push("/home");
        }
        catch (error) {
            console.log("error");
            setValidOtp(false);
        }
    }

    console.log(user?.user?.token);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <BackArrow />
            <View style={{ marginTop: 5 }}>
                {/* <Image source={require("../assets/images/MobileBro.png")} style={{ width: 250, height: 240 }} /> */}
                <Text style={[styles.textColor,{fontFamily:"Poppins-Bold",fontSize:30}]}>Enter The One Time Password</Text>
                <Text style={[styles.textColor,{fontFamily:"Poppins-Light"}]}>Enter The One Time Passcode Sent To Your Email</Text>
            </View>
            <View style={{
                flexDirection: 'row',
                alignItems: "center",
                justifyContent: "center",
                marginTop:10
            }}>

                {otp.map((digits, index) => {
                    return (
                        <View key={index}>
                            <OtpDigits index={index} digits={digits} validOtp={validOtp} handleOtpChange={handleOtpChange} />
                        </View>
                    )
                })}
            </View>
            <View style={{ alignItems: "center", marginVertical: 10, flexDirection: "row", justifyContent: "center" }}>
                {resendOtp ?
                    <Text style={[styles.textColor, { fontFamily: "Poppins-Light" }]}>Resend Otp</Text>
                    :
                    <>
                        <Text style={[styles.textColor, { fontFamily: "Poppins-Light" }]} onPress={() => setOtp(user?.user?.token)}>Resend Otp In </Text>
                        <CustomCountDown
                            until={90} // Set the desired countdown time in seconds
                            onFinish={() => setResendOtp(true)}
                        />
                    </>
                }
            </View>
            <View style={{ alignItems: "center" }}>
                {!validOtp && <Text style={{ fontFamily: "Poppins-Bold", color: "red" }}>Invalid Otp</Text>}
            </View>
            <TouchButton onPress={VerifyOtp} text="Verify Otp" />
        </View>
    )
}

export default OtpAuth;

const styles = StyleSheet.create({
    container: {
        paddingVertical: 55,
        paddingHorizontal: 25,
        height: "100%",
        backgroundColor: Colors.theme.backgroundColor
    },
    box: {
        borderWidth: 1,
        width: 60,
        height: 60,
        marginHorizontal: 5,
        borderRadius: 5,
        textAlign: "center",
        fontFamily: "Poppins-Light"
    },
    textColor: {
        color: Colors.theme.fontColor
    }
});
