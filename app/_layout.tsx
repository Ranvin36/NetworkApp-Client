import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { Provider, useSelector } from 'react-redux';
import store, { rootStore } from './redux/store'
import {Tabs} from 'expo-router'
import ProtectedRoutes from "@/components/ProtectedRoutes";
import { GestureHandlerRootView } from "react-native-gesture-handler";    
export default function RootLayout() {
  const[fontsLoaded] = useFonts({
    "Poppins-Bold": require('../assets/fonts/Poppins-Bold.ttf'),
    "Poppins-Light": require('../assets/fonts/Poppins-Light.ttf'),
    "Poppins-Regular": require('../assets/fonts/Poppins-Regular.ttf'),
    "PlaywriteSK-Regular": require('../assets/fonts/PlaywriteSK-Regular.ttf'),
  })

  if(fontsLoaded){
    return (  
      // <RealmProvider>
        <Provider store={store}>   
          <GestureHandlerRootView>

          <Stack screenOptions={{
            headerShown:false
          }}>
              <Stack.Screen name="login"  />
              <Stack.Screen name="register" />
              <Stack.Screen name="otpAuth" />
              <Stack.Screen name="settings" />
              <Stack.Screen name="liked" />
              <Stack.Screen name="posts" />
              <Stack.Screen name="newPassword" />
              <Stack.Screen name="chats" />
              <Stack.Screen name="forgotPassword" />
              <Stack.Screen name="viewProfile/[id]" />
            {/* <Stack.Screen name="home" /> */}
            {/* <Stack.Screen name="profile" /> */}
          </Stack>
        </GestureHandlerRootView>   
        </Provider>
     
  )}
}
