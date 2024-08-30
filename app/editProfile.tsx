import BackArrow from "@/components/backArrow";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { ColorPalatte } from "@/constants/Colors";
import ProfileTextInput from "@/components/profileTextInput";
import { useDispatch, useSelector } from "react-redux";
import { rootStore } from "./redux/store";
import { MaterialIcons, Ionicons, Feather } from "@expo/vector-icons";
import { useState } from "react";
import axios from "axios";
import { ipAddress } from "@/constants/ipAddress";
import { updateProfilePic } from "./redux/userSlice";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";

const Colors = ColorPalatte();

const EditProfile: React.FC = () => {
  const user = useSelector((state: rootStore) => state.user.user);
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(1);
  const [dropDownOpened, setDropDownOpened] = useState(true);
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState<any>(null); // Use any for the initial state
  const [username, setUsername] = useState(user?.data.username);
  const [bio, setBio] = useState("");

  async function UpdateProfilePic() {
    const selectImage = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [4, 3],
      allowsEditing: true,
      quality: 1,
    });

    if (!selectImage.canceled) {
      const uri = selectImage.assets[0].uri;
      setProfilePic({
        uri,
        name: selectImage.assets[0].fileName,
        type: selectImage.assets[0].mimeType,
      });
    }
  }

  async function SaveProfile() {
    const formData = new FormData();
    formData.append("username", username);
    if (profilePic) {
      formData.append("image", {
        uri: profilePic.uri,
        name: profilePic.name,
        type: profilePic.type,
      });
    }
    console.log(formData);
    const response = await axios.post(
      `http://${ipAddress}:3001/users/edit`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(response.data);
    router.push("/profile");
  }

  function ToggleDropDown() {
    setDropDownOpened((prev) => !prev);
  }

  console.log(username, profilePic, "PROF");
  return (
    <View style={styles.container}>
      <View style={styles.titleHeader}>
        <BackArrow />
        <Text style={styles.headerText}>Edit Profile</Text>
      </View>
      <View style={styles.editContent}>
        <View style={{ alignItems: "center" }}>
          <View>
            {profilePic && profilePic.uri ? ( // Check if profilePic is not null and has a uri
              <Image source={{ uri: profilePic.uri }} style={styles.profilePicture} />
            ) : (
              <Image
                source={{ uri: user?.data.profilePicture }}
                style={styles.profilePicture}
              />
            )}
            <TouchableOpacity style={styles.editIcon} onPress={UpdateProfilePic}>
              {loading ? (
                <ActivityIndicator />
              ) : (
                <Feather name="edit-2" size={20} color={Colors.theme.fontColor} />
              )}
            </TouchableOpacity>
          </View>
          <Text
            style={{
              fontFamily: "Poppins-Light",
              marginTop: 5,
              color: Colors.theme.fontColor,
            }}
          >
            {user?.data.username}
          </Text>
        </View>
        <View style={{ width: "100%", paddingHorizontal: 5, marginTop: 10 }}>
          <ProfileTextInput
            user={user}
            placeholder="Edit Username"
            value={username}
            onChange={setUsername}
          />
          <ProfileTextInput
            user={user}
            placeholder="Edit Bio"
            value={bio}
            onChange={setBio}
          />
          <View>
            <View style={styles.textLabel}>
              <Text style={{ fontFamily: "Poppins-Light", color: Colors.theme.fontColor }}>
                Gender
              </Text>
            </View>
            <TouchableOpacity style={styles.dropDownSelect} onPress={ToggleDropDown}>
              <Text style={{ fontFamily: "Poppins-Light", color: Colors.theme.fontColor }}>
                {!selected ? "Male" : "Female"}
              </Text>
              <View>
                <MaterialIcons
                  name={`arrow-drop-${dropDownOpened ? "down" : "up"}`}
                  size={24}
                  color={Colors.theme.fontColor}
                />
              </View>
              <View style={[styles.dropDown, { height: dropDownOpened ? 0 : null }]}>
                <TouchableOpacity
                  style={[
                    styles.dropDownProps,
                    selected == 0 ? styles.selectedOption : null,
                  ]}
                  onPress={() => setSelected(0)}
                >
                  <View style={{ marginRight: 5 }}>
                    <Ionicons name="male" size={24} color={Colors.theme.fontColor} />
                  </View>
                  <Text style={{ fontFamily: "Poppins-Light", color: Colors.theme.fontColor }}>
                    Male
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.dropDownProps,
                    selected == 1 ? styles.selectedOption : null,
                  ]}
                  onPress={() => setSelected(1)}
                >
                  <View style={{ marginRight: 5 }}>
                    <Ionicons name="female" size={24} color={Colors.theme.fontColor} />
                  </View>
                  <Text style={{ fontFamily: "Poppins-Light", color: Colors.theme.fontColor }}>
                    Female
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={SaveProfile}>
        <Text style={styles.saveBtnText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: Colors.theme.backgroundColor,
    height: "100%",
  },
  titleHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontFamily: "Poppins-Bold",
    fontSize: 20,
    marginHorizontal: 10,
    color: Colors.theme.fontColor,
  },
  profilePicture: {
    width: 90,
    height: 90,
    borderRadius: 20,
  },
  editContent: {
    alignItems: "center",
    paddingVertical: 20,
  },
  textInput: {
    width: "100%",
    backgroundColor: Colors.theme.backgroundTransparent,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  textLabel: {
    marginHorizontal: 10,
  },
  dropDownSelect: {
    borderWidth: 1,
    borderColor: Colors.theme.backgroundTransparent,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    position: "relative",
  },
  dropDown: {
    borderRadius: 10,
    backgroundColor: Colors.theme.backgroundTransparent,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: -140,
  },
  dropDownProps: {
    marginHorizontal: 10,
    paddingHorizontal: 10,
    marginVertical: 10,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  selectedOption: {
    backgroundColor: Colors.theme.backgroundColor,
    borderRadius: 10,
  },
  saveButton: {
    backgroundColor: Colors.theme.primary,
    paddingVertical: 18,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 140,
  },
  saveBtnText: {
    fontFamily: "Poppins-Light",
    color: "#fff",
  },
  editIcon: {
    position: "absolute",
    bottom: -10,
    right: -10,
    backgroundColor: Colors.theme.commentsBg,
    padding: 5,
    borderRadius: 50,
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    elevation: 1,
  },
});
