import { Box } from "@chakra-ui/react";

interface ILayloutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: ILayloutProps) => {
  return (
    <Box w={"100vw"} h={"100vh"} bgColor={"black"}>
      {children}
    </Box>
  );
};
