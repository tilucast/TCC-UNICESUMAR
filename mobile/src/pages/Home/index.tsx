import { Feather as Icon } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { Box, KeyboardAvoidingView, Pressable, Text } from "native-base";
import React, { useEffect, useState } from "react";
import { Image } from "react-native";
import { useIBGECity, useIBGEUf } from "../../hooks/IBGE";

interface Label {
  label: string;
  value: string;
}
("");
const Home = () => {
  const [uf, setUf] = useState("");
  const [city, setCity] = useState("");

  const [labeledUf, setLabeledUf] = useState<Label[]>([]);

  const navigation = useNavigation();

  const { cities } = useIBGECity({ uf, callback: setCity });
  const { ufInitials } = useIBGEUf();

  const navigateToPointsScreen = () =>
    navigation.navigate("Empresas", {
      uf,
      city,
    });

  const handleNavigateCreateBusiness = () =>
    navigation.navigate("CreateBusiness");

  useEffect(() => {
    if (!ufInitials) return;

    const labeled = ufInitials.map((uf) => {
      return { label: uf, value: uf };
    });

    setLabeledUf(labeled);
  }, [ufInitials]);

  return (
    <KeyboardAvoidingView contentContainerStyle={{ flexGrow: 1 }}>
      <Box h="100%" bg="primary.100" p={4}>
        <Box>
          <Image source={require("../../assets/logo.png")} />

          <Text color="primary.400" fontSize={32} maxW={240} mt={8}>
            App de coleta de materiais recicláveis
          </Text>
        </Box>

        <Box flex={1} justifyContent="space-between">
          <Pressable
            mb={5}
            bg="primary.500"
            flexDir="row"
            overflow="hidden"
            alignItems="center"
            mt="6"
            borderRadius={6}
            h="16"
            onPress={handleNavigateCreateBusiness}
          >
            <Box
              h={16}
              w={16}
              backgroundColor="rgba(0, 0, 0, 0.1)"
              justifyContent="center"
              alignItems="center"
            >
              <Text>
                <Icon name="map-pin" color="#fff" size={24} />
              </Text>
            </Box>

            <Text
              fontWeight="bold"
              fontSize="20"
              flex={1}
              justifyContent="center"
              textAlign="center"
              color="white"
            >
              Criar Empresa
            </Text>
          </Pressable>

          <Box>
            <Text color="primary.400" fontSize={22} maxW={240} mt={8}>
              Selecione uma UF e Cidade
            </Text>
            <Picker onValueChange={(value) => setUf(value)} selectedValue={uf}>
              {labeledUf.map(({ label, value }) => (
                <Picker.Item key={value} label={label} value={value} />
              ))}
            </Picker>

            <Picker
              onValueChange={(value) => setCity(value)}
              selectedValue={city}
            >
              {cities.map(({ label, value }) => (
                <Picker.Item key={value} label={label} value={value} />
              ))}
            </Picker>

            <Pressable
              bg="primary.500"
              flexDir="row"
              overflow="hidden"
              alignItems="center"
              mt="2"
              borderRadius={6}
              h="16"
              onPress={navigateToPointsScreen}
            >
              <Text ml={4}>
                <Icon name="log-in" color="#fff" size={24} />
              </Text>

              <Text
                fontWeight="bold"
                fontSize="20"
                flex={1}
                justifyContent="center"
                textAlign="center"
                color="white"
              >
                Procurar Empresas
              </Text>
            </Pressable>
          </Box>
        </Box>
      </Box>
    </KeyboardAvoidingView>
  );
};

export default Home;
