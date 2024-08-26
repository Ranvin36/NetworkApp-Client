import AsyncStorage from "@react-native-async-storage/async-storage";

async function GetAsyncColorCode() {
  try {
    const value = await AsyncStorage.getItem('themeMode');
    if (value !== null) {
      return JSON.parse(value);  // Return parsed value
    } else {
      return 0;  // Default to light mode if no value is found
    }
  } catch (error) {
    console.error("Error fetching theme mode from AsyncStorage:", error);
    return 0;  // Default to light mode in case of error
  }
}

export default GetAsyncColorCode;
