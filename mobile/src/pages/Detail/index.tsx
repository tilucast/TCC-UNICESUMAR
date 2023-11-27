import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as MailComposer from "expo-mail-composer";
import { Box, Image, Pressable, Stack, Text } from "native-base";
import React, { useEffect, useState } from "react";
import { Alert, Linking } from "react-native";
import { items } from "../../constants";
import api from "../../services/api";
import { Item } from "../CreateBusiness/itens-coleta.interfaces";

interface Params {
  empresaId: number;
}

interface EmpresaData {
  empresa: {
    image: string;
    image_url: string;
    name: string;
    email: string;
    whatsapp: string;
    city: string;
    uf: string;
    empresaItems: [{ id: number }];
  };
}

type _EmpresaData = Omit<EmpresaData, "empresaItems">;
interface EmpresaData2 extends _EmpresaData {
  items: Item[];
}

const Detail = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [empresaData, setEmpresaData] = useState<EmpresaData2>(
    {} as EmpresaData2
  );

  const routeParams = route.params as Params;

  const handleWhatsapp = () => {
    Linking.openURL(
      `whatsapp://send?phone=${empresaData.empresa.whatsapp}&text=Tenho interesse sobre coleta de materiais.`
    )
      .then(() => {})
      .catch((e) =>
        Alert.alert(
          "Não foi possível abrir o Whatsapp.",
          "Verifique se possui o aplicativo instalado em seu dispositivo."
        )
      );
  };

  const handleComposeMail = () => {
    MailComposer.composeAsync({
      subject: "Interesse na coleta de materiais",
      recipients: [empresaData.empresa.email],
    })
      .then(() => {})
      .catch(() =>
        Alert.alert(
          "Algo de errado aconteceu.",
          "Não foi possível abrir o email. Tente novamente."
        )
      );
  };

  useEffect(() => {
    api.get(`empresas/${routeParams.empresaId}`).then((res) => {
      const _items: EmpresaData = res.data;

      const pipedItems = pipe(
        _items.empresa.empresaItems.map((empresaItem) => empresaItem.id),
        (_items: number[]) => items.filter((item) => _items.includes(item.id))
      );

      setEmpresaData({ ...res.data, items: pipedItems });
    });
  }, []);

  if (!empresaData.empresa) {
    return null;
  }

  return (
    <Stack bg="primary.100" space={4} flex={1}>
      <Box flex={1} p={8}>
        <Pressable>
          <Icon
            name="arrow-left"
            size={20}
            color="#0080ff"
            onPress={() => navigation.goBack()}
          />
        </Pressable>

        <Image
          alt="Imagem do ponto de coleta/empresa"
          w="100%"
          h="200"
          resizeMode="cover"
          borderRadius={4}
          mt={10}
          source={{ uri: empresaData.empresa.image_url }}
        />

        <Stack space={8}>
          <Stack space={2}>
            <Text color="primary.500" fontSize={30} bold>
              {empresaData.empresa.name}
            </Text>
            <Text color="gray.400" fontSize={14}>
              {empresaData.items.map((item) => item.title).join(", ")}
            </Text>
          </Stack>

          <Stack space={2}>
            <Text fontSize={24} fontWeight="medium" color="gray.400">
              Endereço
            </Text>
            <Text color="gray.400" fontSize={14}>
              {empresaData.empresa.city}, {empresaData.empresa.uf}
            </Text>
          </Stack>
        </Stack>
      </Box>

      <Stack
        bg="primary.500"
        py={4}
        px={10}
        space={4}
        flexDir="row"
        justifyContent="space-between"
      >
        <Pressable
          minW={120}
          borderRadius={4}
          py={2}
          px={4}
          bg="white"
          alignItems="center"
          onPress={handleWhatsapp}
        >
          <Icon name="whatsapp" size={30} color="#0080ff" />
          <Text bold color="primary.400" fontSize={16}>
            Whatsapp
          </Text>
        </Pressable>

        <Pressable
          minW={120}
          borderRadius={4}
          py={2}
          px={4}
          bg="white"
          alignItems="center"
          onPress={handleComposeMail}
        >
          <Icon name="mail" size={30} color="#0080ff" />
          <Text bold color="primary.400" fontSize={16}>
            E-mail
          </Text>
        </Pressable>
      </Stack>
    </Stack>
  );
};

export default Detail;

type PipeFunction<T, U> = (value: T) => U;

function pipe<T, U>(value: T, ...functions: PipeFunction<any, any>[]): U {
  return functions.reduce(
    (currentValue, func) => func(currentValue),
    value
  ) as unknown as U;
}
