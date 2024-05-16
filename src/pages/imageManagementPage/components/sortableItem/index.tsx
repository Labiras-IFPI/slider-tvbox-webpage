import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  GridItem,
  Image,
  Text,
  layout,
  layoutPropNames,
  useBoolean,
} from "@chakra-ui/react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { HtmlHTMLAttributes, useEffect, useState } from "react";
import { RemoveIcon } from "../../../../shared/icons";
import { Variants, motion, useAnimation } from "framer-motion";
import { set } from "firebase/database";

interface ISortable extends HtmlHTMLAttributes<HTMLDivElement> {
  value: any;
  id: string;
  handleRemove: (id: string) => void;
  deleteMode: boolean;
}

type AnimationStates = "off" | "shake_left" | "shake_right";

const SortableItem = ({ handleRemove, deleteMode, ...props }: ISortable) => {
  const [onMouse, setOnMouse] = useBoolean(false);
  const [isLoading, setIsLoading] = useBoolean(false);

  const [animationState, setAnimationState] = useState<AnimationStates>("off");

  const controls = useAnimation();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.id });

  const handleMouseEnter = (e) => {
    setOnMouse.on();
  };

  const handleMouseOff = (e) => {
    setOnMouse.off();
  };

  const shakeVariants: Variants = {
    shake_right: {
      scale: 1,
      rotate: [-3, 3, -3, 3], // Rotate the image back and forth
      transition: {
        duration: 1.5,
      },
    },
    shake_left: {
      scale: 1,
      rotate: [3, -3, 3, -3], // Rotate the image back and forth
      transition: {
        duration: 1.5,
      },
    },
    off: {
      rotate: 0,
    },
  };

  const shake = () => {
    setAnimationState((state) => {
      if (state === "off") {
        return "off";
      }
      if (state === "shake_left") {
        return "shake_right";
      }

      return "shake_left";
    });
  };

  useEffect(() => {
    if (deleteMode) {
      setAnimationState("shake_right");
      return;
    }

    setAnimationState("off");
  }, [deleteMode]);

  return (
    <GridItem
      ref={setNodeRef}
      transform={CSS.Transform.toString(transform)}
      transition={transition}
      width={"100%"}
      height={40}
      position={"relative"}
      zIndex={isDragging ? "100" : "auto"}
      opacity={isDragging ? 0.3 : 1}
    >
      {deleteMode ? (
        <Box
          w={"100%"}
          height={"23%"}
          top={0}
          right={0}
          bgColor={"rgba(189, 186, 186, 0.5)"}
          position={"absolute"}
          borderTopRadius={"999px"}
          zIndex={"10000"}
        >
          <RemoveIcon
            position={"absolute"}
            top={2}
            right={4}
            boxSize={6}
            cursor={"pointer"}
            onClick={() => handleRemove(props.id)}
          />
        </Box>
      ) : null}
      <Box
        height={"100%"}
        // onMouseEnter={handleMouseEnter}
        // onMouseLeave={handleMouseOff}
        {...listeners}
        {...attributes}
        padding={0}
        borderRadius={"999px"}
        as={motion.div}
        // whileHover={{ scale: !deleteMode ? 1.1 : undefined }}
        variants={shakeVariants}
        animate={animationState}
        onAnimationComplete={shake} // Reset animation on completion
      >
        <Image
          src={props.value["image-url"]}
          alt="Not Loaded"
          w={"100%"}
          height={"100%"}
          borderRadius={"2.125rem"}
          objectFit={"cover"}
        />
      </Box>
    </GridItem>
  );
};

export default SortableItem;
