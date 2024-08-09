import { Tabs } from "expo-router";
import { AntDesign } from '@expo/vector-icons';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import TabBar from "@/components/tabBar";
export default function _layout(){
    return(
        <GestureHandlerRootView>
        <Tabs 
        tabBar={props => <TabBar {...props}/>}
        screenOptions={{
            headerShown:false,
        
        }}>
            <Tabs.Screen name="home" options={{
                tabBarShowLabel:false,
                tabBarIcon:({focused})=>{
                    return(
                        <AntDesign name="home" size={28} color="#d92b68" />
                    )
                }
            }} />
            <Tabs.Screen name="profile" options={{
                tabBarShowLabel:false,
                tabBarIcon:({focused})=>{
                    return(
                       <AntDesign name="user" size={28} color="#d92b68" />                   
                    )
                }
            }} />
            <Tabs.Screen name="add" options={{
                tabBarShowLabel:false,
                tabBarIcon:({focused})=>{
                    return(
                       <AntDesign name="pluscircle" size={28} color="#d92b68" />                   
                    )
                }
            }} />

           <Tabs.Screen name="reels" options={{
                tabBarShowLabel:false,
                tabBarIcon:({focused})=>{
                    return(
                        <AntDesign name="videocamera" size={27} color="#d92b68" />
                    )
                }
            }} />

            <Tabs.Screen name="search" options={{
                tabBarShowLabel:false,
                tabBarIcon:({focused})=>{
                    return(
                        <AntDesign name="search1" size={27} color="#d92b68" />
                                          
                    )
                }
            }} />
          

        </Tabs>
        </GestureHandlerRootView>
    )
}