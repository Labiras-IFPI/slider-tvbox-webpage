import {
  Flex,
  Image,

  useToast,
} from "@chakra-ui/react";
import ifpi_logo_black from "../../../assets/images/ifpi_logo_black.png";
import labiras_logo from "../../../assets/images/labiras_logo.png";
import { LogoutIcon, UserIcon } from "../../icons";
import { useAuth } from "../../hooks/use_auth";
import { useNavigate } from "react-router-dom";

export function NavBar() {
  const { logOut } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogOut = () => {
    logOut()
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        toast({
          title: "Erro ao desconectar usuário",
          status: "error",
          isClosable: true,
          duration: 3000,
        });
      });
  };
  return (
    <Flex
      display={"flex"}
      justifyContent={"space-between"}
      flexDirection={"row"}
      alignItems={"center"}
      height={"5%"}
      w={"100%"}
      h={"15%"}
      borderBottom={`2px solid yellow`}
      backgroundColor={"black"}
      p={3}
    >
      <Flex gap={".5rem"} alignItems={"center"}>
        <Image
          src={ifpi_logo_black}
          objectFit={"cover"}
          boxSize={{ base: "30%", sm: "20%"}}
          // w={"20%"}
        />
        <Image
          src={labiras_logo}
          objectFit={"cover"}
          boxSize={"40%"}
          //  w={"40%"}
        />
      </Flex>
      <Flex gap={".5rem"}>
        <UserIcon color={"yellow"} boxSize={7} />
        <LogoutIcon
          color={"yellow"}
          boxSize={7}
          onClick={handleLogOut}
          cursor={"pointer"}
        />
      </Flex>
    </Flex>
  );
}
