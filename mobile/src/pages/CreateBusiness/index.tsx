import { Feather as Icon } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import * as Location from "expo-location";
import {
  Box,
  Input,
  KeyboardAvoidingView,
  Pressable,
  Stack,
  Text,
} from "native-base";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, ScrollView, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useIBGECity, useIBGEUf } from "../../hooks/IBGE";
import api from "../../services/api";
import ImagePicker from "./ImagePicker";
import ItensColeta from "./ItensColeta";

interface Label {
  label: string;
  value: string;
}

interface Form {
  name: string;
  email: string;
  whatsapp: string;
  city: string;
  uf: string;
}

const CreateBusiness = () => {
  const navigation = useNavigation();

  const [imagePickerImage, setImagePickerImage] = useState<string | null>(null);

  const [labeledUf, setLabeledUf] = useState<Label[]>([]);

  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    0, 0,
  ]);

  const [selectedMapPoint, setSelectedMapPoint] = useState<[number, number]>([
    0, 0,
  ]);

  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Form>();

  const selectedUf = watch("uf");

  const { cities } = useIBGECity({
    uf: selectedUf,
    callback: (value) => setValue("city", value),
  });

  const { ufInitials } = useIBGEUf();

  function handleSelectItem(id: number) {
    const alreadyClicked = selectedItems.findIndex((item) => item === id);

    if (alreadyClicked >= 0) {
      const filteredItems = selectedItems.filter((item) => item !== id);

      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  }

  async function onSubmit(_data: Form) {
    const { city, email, name, uf, whatsapp } = _data;

    const [latitude, longitude] = selectedMapPoint;
    const items = selectedItems;

    const data = new FormData();

    data.append("name", name);
    data.append("email", email);
    data.append("whatsapp", whatsapp);
    data.append("uf", uf);
    data.append("city", city);
    data.append("latitude", String(latitude));
    data.append("longitude", String(longitude));
    data.append("items", items.join(","));

    if (imagePickerImage) {
      /**
       * @see issue https://github.com/g6ling/React-Native-Tips/issues/1
       */
      data.append("image", {
        uri: imagePickerImage,
        type: "image/jpeg",
        name: "testandonameaoksodka.jpeg",
      } as unknown as Blob);
    }

    try {
      await api.post("empresas", data);
      Alert.alert("Empresa criada!", "Empresa criada com sucesso!", [
        { onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      err;
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          Alert.alert(
            "Olá!",
            "Precisamos de sua permissão para ter a localização do seu dispositivo."
          );
          return;
        }

        const location = await Location.getCurrentPositionAsync({});

        const { latitude, longitude } = location?.coords;

        setInitialPosition([latitude, longitude]);
      } catch (e) {
        e;
      }
    })();
  }, []);

  useEffect(() => {
    if (!ufInitials) return;

    const labeled = ufInitials.map((uf) => ({ label: uf, value: uf }));

    setLabeledUf(labeled);
  }, [ufInitials]);

  return (
    <KeyboardAvoidingView flex={1}>
      <ScrollView>
        <Box
          bg="primary.100"
          flex={1}
          paddingX={6}
          paddingTop={4 + Constants.statusBarHeight}
        >
          <Pressable>
            <Icon
              name="arrow-left"
              size={20}
              color="#003265"
              onPress={() => navigation.goBack()}
            />
          </Pressable>

          <Text fontSize={20}>Cadastro da Empresa</Text>

          <ImagePicker getImage={setImagePickerImage} />

          <Stack mt={2} space={5}>
            <Text fontSize={20} color="primary.400">
              Dados da empresa
            </Text>

            <Stack space={3}>
              <Box>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      bg="white"
                      p={3}
                      fontSize={16}
                      placeholder="Nome do estabelecimento"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                {errors.name && (
                  <Text style={styles.error}>Campo Obrigatório</Text>
                )}
              </Box>

              <Stack space={2} direction="row">
                <Box flex={2}>
                  <Controller
                    name="email"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        bg="white"
                        placeholder="E-mail"
                        keyboardType="email-address"
                        fontSize={16}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                      />
                    )}
                  />
                  {errors.email && (
                    <Text style={styles.error}>Campo Obrigatório</Text>
                  )}
                </Box>

                <Box flex={1}>
                  <Controller
                    name="whatsapp"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        bg="white"
                        placeholder="Whatsapp"
                        keyboardType="phone-pad"
                        fontSize={16}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                      />
                    )}
                  />
                  {errors.whatsapp && (
                    <Text style={styles.error}>Campo Obrigatório</Text>
                  )}
                </Box>
              </Stack>
            </Stack>

            <Text fontSize={20} color="primary.400">
              Endereço
            </Text>

            <Box
              flex="1"
              width="100%"
              borderRadius={4}
              overflow="hidden"
              mt="4"
            >
              {initialPosition[0] !== 0 && (
                <MapView
                  onPress={(e) => {
                    setSelectedMapPoint([
                      e.nativeEvent.coordinate.latitude,
                      e.nativeEvent.coordinate.longitude,
                    ]);
                  }}
                  style={styles.map}
                  initialRegion={{
                    latitude: initialPosition[0],
                    longitude: initialPosition[1],
                    latitudeDelta: 0.014,
                    longitudeDelta: 0.014,
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: selectedMapPoint[0],
                      longitude: selectedMapPoint[1],
                    }}
                  >
                    <Icon name="map-pin" size={20} color="#0080ff" />
                  </Marker>
                </MapView>
              )}
            </Box>

            <Stack direction="row" space={2}>
              <Box bg="white" flex={1}>
                <Controller
                  name="uf"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Picker
                      onBlur={onBlur}
                      onValueChange={onChange}
                      selectedValue={value}
                    >
                      {labeledUf.map(({ label, value }) => (
                        <Picker.Item key={value} label={label} value={value} />
                      ))}
                    </Picker>
                  )}
                />
                {errors.uf && (
                  <Text style={styles.error}>Campo Obrigatório</Text>
                )}
              </Box>

              <Box bg="white" flex={2}>
                <Controller
                  name="city"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Picker
                      onBlur={onBlur}
                      onValueChange={onChange}
                      selectedValue={value}
                    >
                      {cities.map(({ label, value }) => (
                        <Picker.Item key={value} label={label} value={value} />
                      ))}
                    </Picker>
                  )}
                />
                {errors.uf && (
                  <Text style={styles.error}>Campo Obrigatório</Text>
                )}
              </Box>
            </Stack>

            <Text fontSize={20} color="primary.400">
              Ítens de coleta
            </Text>

            <ItensColeta
              handleSelectItem={handleSelectItem}
              selectedItems={selectedItems}
            />

            <Pressable
              flex={1}
              justifyContent="center"
              mt={4}
              h={60}
              bg="primary.500"
              borderRadius={4}
              mb={10}
              onPress={handleSubmit(onSubmit)}
            >
              <Text textAlign="center" color="white" bold={true} fontSize={20}>
                Criar Empresa
              </Text>
            </Pressable>
          </Stack>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateBusiness;

const styles = StyleSheet.create({
  error: {
    color: "#ff0000",
    fontWeight: "bold",
  },
  map: {
    minHeight: 200,
    width: "100%",
    height: "100%",
  },
});
