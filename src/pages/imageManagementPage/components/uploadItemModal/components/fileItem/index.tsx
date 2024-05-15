import {
  Button,
  Flex,
  Icon,
  Progress,
  Stack,
  Text,
  effect,
  useBoolean,
} from "@chakra-ui/react";
import { DeleteIcon, FileIcon } from "../../../../../../shared/icons";
import { UploadProgress } from "../../../../../../models/genericModels/upload_progress";
import { hidePartOfText } from "../../../../../../shared/utils/hide_part_of_text";
import { Loading } from "../../../../../../shared/components/loading";
import { useEffect } from "react";
import React from "react";

interface IFileItem extends UploadProgress {
  handleDelete: (id: string) => void;
  uploadStart: boolean;
  blockModal: {
    on: () => void;
    off: () => void;
    toggle: () => void;
  };
  handleUploadChange: React.Dispatch<React.SetStateAction<UploadProgress[]>>;
}

export function FileItem({
  id,
  handleDelete,
  blockModal,
  state,
  task,
  handleUploadChange,
  uploadStart,
  ...props
}: IFileItem) {
  const progressPorcentage = Math.floor(
    (props.sizeTransfered / props.totalSize) * 100
  );

  const [loadingDelete, setLoadingDelete] = useBoolean(false);

  return (
    <Flex
      borderRadius={"lg"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      gap={".4rem"}
      border={"1px solid #0C0C0C"}
      w={"100%"}
      p={".5rem"}
    >
      <Flex
        h={"90%"}
        w={"100%"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <FileIcon
          boxSize={5}
          flex={0.5}
          display={{ base: "none", md: "block" }}
        />

        <Flex
          flexDirection={"column"}
          justifyContent={"flex-start"}
          alignItems={"start"}
          flex={2}
        >
          <Text>{hidePartOfText(props.name, 7, 7)}</Text>
          <Flex>
            <Text>
              {props.sizeTransfered / 1000}mb {"|"} {progressPorcentage}%
            </Text>
          </Flex>
        </Flex>

        <Button
          p={0}
          onClick={
            state !== "notStarted"
              ? undefined
              : () => (handleDelete(id))
          }
          isLoading={loadingDelete}
          _hover={{
            borderColor: "red",
            backgroundColor: "red",
            cursor: state !== "notStarted" ? "not-allowed" : "pointer",
          }}
          flex={0.5}
        >
          <DeleteIcon boxSize={5} />
        </Button>
      </Flex>
      <Stack h={"10%"} w={"100%"}>
        <Progress
          colorScheme={"green"}
          value={progressPorcentage}
          size={"lg"}
          p={".1rem"}
        />
      </Stack>
    </Flex>
  );
}
