import { View, Text, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { rootStore } from '@/app/redux/store';

import { ColorPalatte } from "@/constants/Colors";
const Colors = ColorPalatte();

export default function TabBar({ state, descriptors, navigation }) {
  const navbarOpened = useSelector((state:rootStore) => state.navbar.navbar)
  return (
    <View style={{ flexDirection: 'row',borderTopLeftRadius:30,paddingVertical:20,borderTopRightRadius:30,display:navbarOpened?"none" :"flex",zIndex:1,backgroundColor:Colors.theme.commentsBg,elevation:10,position:"absolute",bottom:0}}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        }

        const icons ={
            home : (props) => <AntDesign name="home" size={28} color="#d92b68" {...props} />, 
            profile : (props) => <AntDesign name="user" size={28} color="#d92b68" {...props} />, 
            add : (props) => <AntDesign name="pluscircle" size={28} color="#d92b68" {...props} />, 
            reels : (props) => <AntDesign name="videocamera" size={28} color="#d92b68" {...props} />, 
            search : (props) => <AntDesign name="search1" size={28} color="#d92b68" {...props} />, 

        }

        return (
          <TouchableOpacity key={index}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, alignItems:"center"}}
          >
            {icons[route.name]({
                color: isFocused ? Colors.light.text : Colors.light.text
            })}

          </TouchableOpacity>
        );
      })}
    </View>
  );
}