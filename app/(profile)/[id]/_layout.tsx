import type {ParamListBase, TabNavigationState} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import type {
  MaterialTopTabNavigationOptions,
  MaterialTopTabNavigationEventMap,
} from '@react-navigation/material-top-tabs';
import {useLocalSearchParams, withLayoutContext} from 'expo-router';
import { View , StyleSheet, Text,TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
const {Navigator} = createMaterialTopTabNavigator()
export const MaterialTopTabs = withLayoutContext<
    MaterialTopTabNavigationOptions,
    typeof  Navigator,
    TabNavigationState<ParamListBase>,
    MaterialTopTabNavigationEventMap
>(Navigator)


export default function _layout(){
    const {id} = useLocalSearchParams()  
    const router = useRouter()
    return(
        <View style={styles.container}>
            <View style={styles.homeHeader}>
            <View>
                <Text style={{fontFamily:"PlaywriteSK-Regular",fontSize:25, color:"#d92b68"}}>Fleexy</Text>
            </View>
            <View style={{flexDirection:"row"}}>
                <TouchableOpacity style={styles.headerIcon}> 
                    <AntDesign name="hearto" size={20} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerIcon} onPress={()=> router.push('/profile')}>
                    <Feather name="bookmark" size={20} color="black" />
                </TouchableOpacity>
            </View>
        </View>
            <MaterialTopTabs>
                <MaterialTopTabs.Screen name='followers' initialParams={{id}} />
                <MaterialTopTabs.Screen name='following' initialParams={{id}}/>
            </MaterialTopTabs>
        </View>
    )
}


const styles = StyleSheet.create({
    container:{
        flex:1
    },
    homeHeader:{
        paddingHorizontal:20,
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        // marginTop:30,
        paddingTop:45,
        paddingVertical:5,
        backgroundColor:"#fff"
    },
    headerIcon:{
        margin:5,
        backgroundColor:"#ebe6e6",
        width:35,
        height:35,
        alignItems:"center",
        justifyContent:"center",
        borderRadius:50
    }
})