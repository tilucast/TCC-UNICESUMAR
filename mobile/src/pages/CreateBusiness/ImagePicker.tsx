import * as ImagePickerComponent from "expo-image-picker";
import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

interface ImagePickerProps {
  getImage: (value: React.SetStateAction<string | null>) => void;
}

function ImagePicker(props: ImagePickerProps) {
  const { getImage } = props;

  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePickerComponent.launchImageLibraryAsync({
      mediaTypes: ImagePickerComponent.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      getImage(uri);
    }
  };

  return (
    <TouchableOpacity onPress={pickImage}>
      <View style={styles.container}>
        {image ? (
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
        ) : (
          <Text style={styles.containerText}>Escolha uma imagem</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default ImagePicker;

const styles = StyleSheet.create({
  container: {
    height: 200,
    backgroundColor: "#0080ff",
    borderRadius: 10,
    marginTop: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  containerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "500",
  },
});
