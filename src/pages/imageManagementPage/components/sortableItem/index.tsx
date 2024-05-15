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

interface ISortable extends HtmlHTMLAttributes<HTMLDivElement> {
  value: any;
  id: string;
  handleRemove: (id: string) => void;
}

const SortableItem = ({handleRemove,...props}: ISortable) => {
  const [onMouse, setOnMouse] = useBoolean(false);
  const [isLoading, setIsLoading] = useBoolean(false);

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
      // padding={0}
    >
      {onMouse ? (
        <Box
          w={"100%"}
          height={"23%"}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={setOnMouse.off}
          top={0}
          right={0}
          bgColor={"rgba(189, 186, 186, 0.5)"}
          position={"absolute"}
          borderTopRadius={"999px"}
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
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseOff}
        {...listeners}
        {...attributes}
        padding={0}
        borderRadius={"999px"}
      >
        <Image
          src={props.value["image-url"]}
          alt="Not Loaded"
          w={"100%"}
          height={"100%"}
          borderRadius={"2.125rem"}
          // border={"2px solid yellow"}
        />
      </Box>
    </GridItem>
  );
};

export default SortableItem;
