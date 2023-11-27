import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Flex, Pressable, ScrollView, Text } from "native-base";
import React, { useEffect } from "react";
import { items } from "../../constants";

interface ComponentProps {
  handleSelectItem: (id: number) => void;
  selectedItems: number[];
}

export default function ItensColeta(props: ComponentProps) {
  const { handleSelectItem, selectedItems } = props;

  useEffect(() => handleSelectItem(items[0].id), []);

  return (
    <Flex direction="row" mt={6} mb={6}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 4 }}
      >
        {items.map((item) => (
          <Pressable
            bg="white"
            borderColor="white"
            h={140}
            w={120}
            borderRadius={6}
            paddingX={4}
            paddingY={8}
            mr={4}
            alignItems="center"
            justifyContent="space-between"
            textAlign="center"
            key={String(item.id)}
            style={[
              selectedItems.includes(item.id)
                ? { borderColor: "#003265", borderWidth: 2 }
                : {},
            ]}
            onPress={() => handleSelectItem(item.id)}
          >
            <MaterialCommunityIcons
              name={item.name}
              size={50}
              color="#003265"
            />
            <Text textAlign="center" fontSize={13}>
              {item.title}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </Flex>
  );
}
