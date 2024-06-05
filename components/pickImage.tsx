import { useState } from "react";
import { Button, Image, View, StyleSheet,Text, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import * as FileSystem from "expo-file-system";



import { NativeWindStyleSheet } from "nativewind";
import { red } from "react-native-reanimated/lib/typescript/reanimated2/Colors";






export default function PickImage() {
  const [image, setImage] = useState("")
  const [selectedModel, setSelectedModel] = useState("");
  let formData = new FormData();
  const [base64String, setBase64String] = useState("");

 
  let pickImageButtonLabel = image ? "cancel image" : "Pick an image from camera roll";


  const sendStringsToServer = async () => {
    try {
      console.log("whats going on");
      
      const response = await fetch(
        "http://192.168.1.66:5000//process_strings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            string1: base64String,
            string2: selectedModel,
          }),
        }
      );
      console.log("above data");
      
      const data = await response.json();
      console.log("below data");
      
      console.log(data);
      
      
      
    } catch (error) {
      console.error("Error sending strings to server:", error);
    }
  };

  const pickImage = async () => {
    if (!image) {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result.assets) {
      console.log(result.assets[0].fileName);
      console.log(typeof(result.assets[0]));
      console.log(result.assets[0]);
    }

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      }
      
   
    }
    else {
      setImage("")
    }
    
  };


  const uint8ArrayToBase64 = (uint8Array:any) => {
    let binaryString = "";
    const chunkSize = 0x8000; // Arbitrary chunk size to avoid maximum call stack size exceeded error
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      binaryString += String.fromCharCode.apply(
        null,
        uint8Array.subarray(i, i + chunkSize)
      );
    }
    return btoa(binaryString);
  };

   const convertToBase64 = async () => {
     try {
       const fileInfo = await FileSystem.getInfoAsync(image);
       if (fileInfo.exists) {
         const base64 = await FileSystem.readAsStringAsync(image, {
           encoding: FileSystem.EncodingType.Base64,
         });

        //  //compressing the base64
        //  const binaryString = atob(base64);
        //  const binaryArray = Uint8Array.from(binaryString, (char) =>
        //    char.charCodeAt(0)
        //  );
        //  const compressed = pako.deflate(binaryArray);
        //  const compressedBase64String = uint8ArrayToBase64(compressed);
        //  console.log("before setting");
         
         setBase64String(base64);
         console.log("after setting");
         console.log(base64);
         
         
         
         
         
       }
       
       else {
         console.error("File does not exist:", image);
       }

     }
     
     catch (error) {
       console.error("Error converting to base64:", error);
     }
   };

  return (
    <View  >
      <Picker
        selectedValue={selectedModel}
        placeholder="Select the algorithm to use"
        onValueChange={(itemValue, itemIndex) => setSelectedModel(itemValue)
        }
      >
        <Picker.Item label="ResNext" value="resnext" />
        <Picker.Item label="Inception v4" value="inceptionv4" />
        <Picker.Item label="Inception v3" value="inceptionv3" />
        <Picker.Item label="Yolo v8" value="yolov8" />
        <Picker.Item label="None" value="" />
      </Picker>
      <Button title={pickImageButtonLabel} onPress={pickImage} color={'green'} />

      
        
      {image && <Image source={{ uri: image }} />}
      

      <Button title="submit" onPress={() => {
        console.log("submit pressed");
        console.log(!image);
        console.log(!selectedModel);
        
        
        
        if (!image) {
          Alert.alert("No Image", "Please upload the image first", [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "OK", onPress: () => console.log("OK Pressed") },
          ]);
        }
          if (!selectedModel) {
            Alert.alert("No Model", "Please select the model", [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
              { text: "OK", onPress: () => console.log("OK Pressed") },
            ]);
        }
        if (image && selectedModel) {
          console.log("submit button pressed");
          // convertToBase64();
          console.log(base64String);
          
          if (base64String) {
            console.log("base 64 obtained");
            sendStringsToServer();
          }
          
        }
        
        
        
      }}></Button>
    </View>
  );
}

