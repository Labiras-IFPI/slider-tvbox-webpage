import { Stack, Text } from "@chakra-ui/react";
import React from "react";
import { WarngingIcon } from "../../icons";

interface IErrorPage {
  message: React.ReactNode;
}

export const ErrorPage = ({ message }: IErrorPage) => {
  return (
    <Stack align={"center"}>
      <Stack
        w={{ base: "90%", md: "70%", lg: "50%" }}
        align={"center"}
        textAlign={"center"}
      >
        <WarngingIcon w={"80%"} h={"70%"} color={"yellow"} />
        <Text fontSize={{ sm: "sm", md: "md" }} color={"white"}>
          {message}
        </Text>
      </Stack>
    </Stack>
  );
};
