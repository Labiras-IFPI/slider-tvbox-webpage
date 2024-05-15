import { Stack, Text } from "@chakra-ui/react";
import { MainLayout } from "../../layout";

export const Error404 = () => {
  return (
    <MainLayout>
      <Stack
        w={"100%"}
        h={"100%"}
        alignItems={"center"}
        gap={0}
        color={"yellow"}
      >
        <Stack
          marginTop={"15%"}
          w={"30%"}
          h={"100%"}
          alignItems={"inherit"}
          gap={"4rem"}
        >
          <Stack textAlign={"center"}>
            <Text w={"100%"} fontSize={"10rem"} fontStyle={"italic"}>
              404
            </Text>
            <Text>Desculpe sua página não pôde ser encontrada...</Text>
          </Stack>
        </Stack>
      </Stack>
    </MainLayout>
  );
};
