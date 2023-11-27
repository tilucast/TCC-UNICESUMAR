import { Feather as Icon } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import Constants from "expo-constants";
import * as Location from "expo-location";
import { Box, Image, Pressable, ScrollView, Text } from "native-base";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import api from "../../services/api";
import ItensColeta from "../CreateBusiness/ItensColeta";

interface Empresa {
  id: number;
  name: string;
  image: string;
  image_url: string;
  latitude: number;
  longitude: number;
}

interface Params {
  uf: string;
  city: string;
}

const Empresas = () => {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);

  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    0, 0,
  ]);

  const navigation = useNavigation();
  const route = useRoute();

  const routeParams = route.params as Params;

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
    api
      .get("empresas", {
        params: {
          city: routeParams.city,
          uf: routeParams.uf,
          items: selectedItems.toString(),
        },
      })
      .then((res) => {
        setEmpresas(res.data);
      })
      .catch((error) => {
        error;
      });
  }, [selectedItems]);

  const handleSelectItem = (id: number) => {
    const _selectedItem = selectedItems.findIndex((item) => item === id);

    if (_selectedItem >= 0) {
      const filteredItems = selectedItems.filter((item) => item !== id);

      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  return (
    <ScrollView
      style={{ paddingHorizontal: 8 }}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <Box
        bg="primary.100"
        flex={1}
        paddingX={5}
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

        <Text fontSize={20} mt={4}>
          Olá!
        </Text>
        <Text color="gray.400" fontSize={16} mt="4">
          Encontre no mapa uma empresa.
        </Text>

        <Box h="500px" width="100%" borderRadius={4} overflow="hidden" mt="10">
          {initialPosition[0] !== 0 && (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: initialPosition[0],
                longitude: initialPosition[1],
                latitudeDelta: 0.014,
                longitudeDelta: 0.014,
              }}
            >
              {empresas.map((empresa) => (
                <Marker
                  key={String(empresa.id)}
                  onPress={() =>
                    navigation.navigate("Detail", { empresaId: empresa.id })
                  }
                  style={styles.mapPonto}
                  coordinate={{
                    latitude: empresa.latitude,
                    longitude: empresa.longitude,
                  }}
                >
                  <Box
                    overflow="hidden"
                    alignItems="center"
                    flexDir="column"
                    bg="primary.400"
                    w="100"
                  >
                    <Image
                      width={100}
                      h={55}
                      resizeMode="cover"
                      alt="Imagem do ponto de coleta"
                      source={{ uri: empresa.image_url }}
                    />
                    <Text color="white" fontSize="10" lineHeight="20">
                      {empresa.name}
                    </Text>
                  </Box>
                </Marker>
              ))}
            </MapView>
          )}
        </Box>
      </Box>

      <ItensColeta
        handleSelectItem={handleSelectItem}
        selectedItems={selectedItems}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },

  mapPonto: {
    width: 100,
    height: 100,
  },
});

export default Empresas;
