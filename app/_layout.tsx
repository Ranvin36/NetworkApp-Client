import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import { Provider, useDispatch } from 'react-redux';
import store from './redux/store';
import { GestureHandlerRootView } from "react-native-gesture-handler";    
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from "react";
import { setUser } from "./redux/userSlice";
import axios from "axios";
import { ipAddress } from "@/constants/ipAddress";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Poppins-Bold": require('../assets/fonts/Poppins-Bold.ttf'),
    "Poppins-Light": require('../assets/fonts/Poppins-Light.ttf'),
    "Poppins-Regular": require('../assets/fonts/Poppins-Regular.ttf'),
    "PlaywriteSK-Regular": require('../assets/fonts/PlaywriteSK-Regular.ttf'),
  });

  function AppContent() {
    const dispatch = useDispatch();

    async function GetLocalStorageUser() {
      const getUser = await AsyncStorage.getItem('user');
      return getUser != null ? JSON.parse(getUser) : null;
    }

    useEffect(() => {
      async function VerifyToken(token:string,userData:any){
      try{
          const response  = await axios.post(`http://${ipAddress}:3001/users/verify-token`,null,{
            headers:{
              Authorization:`Bearer ${token}`
            }
          })
          if(!response.data){
            throw Error("Invalid Token")
          }
          dispatch(setUser(userData.user));
          router.push("/home")
        }
        catch(error){
          router.push("/login")
          console.log(error)
        }
      }
      GetLocalStorageUser().then(userData => {
        if (userData && userData.user && userData.user.token) {
            const tokenStatus = VerifyToken(userData.user.token,userData)
        }
      });
    }, [dispatch]);

    if (!fontsLoaded) {
      return null;
    }

    return (
      <GestureHandlerRootView>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="otpAuth" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="liked" />
          <Stack.Screen name="posts" />
          <Stack.Screen name="newPassword" />
          <Stack.Screen name="chats" />
          <Stack.Screen name="forgotPassword" />
          <Stack.Screen name="viewProfile/[id]" />
        </Stack>
      </GestureHandlerRootView>
    );
  }

  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
