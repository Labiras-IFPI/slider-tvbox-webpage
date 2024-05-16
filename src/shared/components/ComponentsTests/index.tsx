import { Box, Flex, useBoolean } from "@chakra-ui/react";
import { Variants, motion } from "framer-motion";

export const MotionTest = () => {
  const shakeVariants: Variants = {
    shake_right: {
      rotate: [-10, 10, -10, 10], // Rotate the image back and forth
      transition: {
        duration: 1,
      },
    },
    shake_left: {
      rotate: [10, -10, 10, -10], // Rotate the image back and forth
      transition: {
        duration: 1,
      },
    },
    off: {
      rotate: 0,
    },
  };

  // Function to trigger the shake animation
  //   const shake = async () => {
  //     await controls.start("shake");
  //     controls.start("start");
  //   };

  const [move, setMove] = useBoolean(false);

  return (
    <Flex w={"100%"} h={"100%"} align={"center"} justify={"center"}>
      <Box
        w={"40%"}
        h={"40%"}
        bgColor={"purple"}
        borderRadius={"25px"}
        as={motion.div}
        whileHover={{ scale: 1.1 }} // Scale the image on hover (optional)
        animate={move ? "on" : "off"}
        variants={shakeVariants}
        onAnimationComplete={() => setMove.toggle()} // Reset animation on completion
        // onClick={setMove.toggle}
      />
    </Flex>
  );
};
