import labiras_logo from "../../assets/images/labiras_logo.png";
import ifpi_logo_black from "../../assets/images/ifpi_logo_black.png";

import {
  AbsoluteCenter,
  AspectRatio,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  Grid,
  Image,
  Input,
  Stack,
  Text,
  color,
  useToast,
} from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAuth } from "../../shared/hooks/use_auth";
import { useNavigate } from "react-router-dom";
import { IUserCredendials } from "../../models/genericModels/user_credential";
import { Loading } from "../../shared/components/loading";
import { FirebaseError } from "firebase/app";

export function LoginPage() {
  const navigate = useNavigate();
  const { logIn } = useAuth();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isValid, isDirty },
    reset,
  } = useForm<IUserCredendials>();

  const toast = useToast();

  const onSubmit: SubmitHandler<IUserCredendials> = (data) => {
    logIn(data)
      .then((user) => {
        if (user) {
          navigate("/gerenciador");
        }
      })
      .catch((e) => {
        if (e instanceof FirebaseError) {
          if (e.message === "INVALID_LOGIN_CREDENTIALS" || "INVALID_EMAIL") {
            toast({
              title: `Erro de credenciais`,
              description: `Email ou senha inválidos`,
              status: "error",
              duration: 2000,
              isClosable: true,
            });

            return;
          }

          toast({
            title: `Erro de credenciais`,
            description: `${e.message.toLowerCase()}`,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Erro desconhecido",
            description: "Recarregue a página e tente novamente",
            status: "error",
            duration: 1000,
            isClosable: true,
          });
        }
      });

    reset();
  };

  // const handleLogin = () => {
  //   loginInWithPopUp(new GoogleAuthProvider())
  //     .then((userCredentials) => {
  //       navigate("/");
  //     })
  //     .catch((error) => console.log(error.message));
  // };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <FormControl
        w={"100%"}
        h={"100%"}
        isInvalid={errors.email || errors.password ? true : false}
      >
        <Grid
          w={"100%"}
          h={"100%"}
          templateColumns={{ base: "1fr", md: "2fr 1fr" }}
          overflow={"hidden"}
        >
          <AspectRatio display={{ base: "none", md: "flex" }}>
            <iframe title="naruto" src="https://labiras.cc/" />
          </AspectRatio>
          <Stack
            p={2}
            w={{ base: "100%", sm: "50%", md: "100%" }}
            justifySelf={"center"}
            marginTop={{ base: "30%", md: "25%" }}
            // alignSelf={"center"}
          >
            <Flex alignItems={"center"}>
              <Image src={ifpi_logo_black} w={"30%"} objectFit={"cover"} />
              <Image src={labiras_logo} w={"70%"} objectFit={"cover"} />
            </Flex>
            <Stack gap={3} color={"white"}>
              <Text fontSize={"2xl"} color={"yellow"}>
                Entrar
              </Text>
              <Input
                placeholder="Email"
                borderRadius={10}
                id="email"
                {...register("email", {
                  required: "Campo obrigatório",
                })}
                focusBorderColor="#f2f632"
              />
              <FormErrorMessage marginTop={0}>
                {errors.email && errors.email.message}
              </FormErrorMessage>
              <Input
                placeholder="Senha"
                borderRadius={10}
                {...register("password", {
                  required: "Campo obrigatório",
                })}
                focusBorderColor={"#f2f632"}
                type="password"
              />
              <FormErrorMessage marginTop={0}>
                {errors.password && errors.password.message}
              </FormErrorMessage>

              <Stack w={"100%"} alignItems={"center"}>
                <Button
                  bgColor={"#272832"}
                  color={"white"}
                  type="submit"
                  borderRadius={10}
                  fontSize={15}
                  w={"35%"}
                  isLoading={isSubmitting}
                  _hover={{ borderColor: "yellow" }}
                >
                  Entrar
                </Button>
                {/* Google funcionality still wasnt inplemented   */}
                {/* <Flex w={"100%"} align={"center"}>
                <Divider />
                <Text p={1} align={"center"}>
                  ou
                </Text>
                <Divider />
              </Flex>
              <Button
                w={"35%"}
                borderRadius={10}
                fontSize={15}
                gap={0.5}
                bgColor={"#272832"}
                alignContent={"center"}
                color={"white"}
                _hover={{ borderColor: "yellow" }}
                onClick={handleLogin}
              >
                <GoogleIcon boxSize={6} />
                Google
              </Button> */}
              </Stack>
            </Stack>
          </Stack>
        </Grid>
      </FormControl>
    </form>
  );
}
