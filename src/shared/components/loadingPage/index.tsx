import { Stack, Text } from "@chakra-ui/react";
import { Loading } from "../loading";
import { MainLayout } from "../layout";

export const LoadingPage = () => {
  return (
    <MainLayout>
      <Stack
        w={"100%"}
        h={"100%"}
        alignItems={"center"}
        gap={0}
        color={"yellow"}
      >
        <Stack marginTop={"15%"} h={"100%"} alignItems={"inherit"} gap={"4rem"}>
          <Stack textAlign={"center"}>
            <Text fontSize={"5rem"} fontStyle={"italic"}>
              Aguarde
            </Text>
            <Text>A sua página esta carregando...</Text>
          </Stack>
          <Loading
            display={"flex"}
            isIndeterminate
            color="yellow"
            w={"100%"}
            justifyContent={"center"}
            position={"relative"}
            alignItems={"center"}
          />
        </Stack>
      </Stack>
    </MainLayout>
  );
};
