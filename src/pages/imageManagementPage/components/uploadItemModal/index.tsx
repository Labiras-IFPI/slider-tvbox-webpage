//Tem q ver pq q mais de um progress de um msm elemento esta
// sendo criado no componente sendo q era pra estar sendo
//era sobreescrito
import {
  Modal,
  ModalContent,
  ModalOverlay,
  ModalBody,
  ModalHeader,
  Text,
  Button,
  Flex,
  Stack,
  Input,
  useBoolean,
  useToast,
  FormControl,
} from "@chakra-ui/react";

import { UploadIcon } from "../../../../shared/icons";
import { useEffect, useState } from "react";
import { genericImageUploadProgress } from "../../../../shared/utils/generic_images_upload_progress";
import { FileItem } from "./components/fileItem";
import { fileListToArray } from "../../../../shared/utils/firebase_to_array";
import { ImageService } from "../../../../services/images_service";
import { ulid } from "ulidx";
import { UploadProgress } from "../../../../models/genericModels/upload_progress";
import { progress } from "framer-motion";
import { IImage } from "../../../../models/image";
import { DndContext } from "@dnd-kit/core";
import { isValidTypeFiles } from "../../../../shared/utils/is_valid_type_files";
import { isSizeExceded } from "../../../../shared/utils/is_size_exeded";
import { hidePartOfText } from "../../../../shared/utils/hide_part_of_text";
import { getDownloadURL } from "firebase/storage";

interface IUploadItemModal {
  isOpen: boolean;
  onClose: () => void;
}

export function UploadItemModal({ isOpen, onClose }: IUploadItemModal) {
  const toast = useToast();
  const [uploadProgresses, setUploadProgresses] = useState<UploadProgress[]>(
    []
    // genericImageUploadProgress
  );

  const [blockClose, setBlockClose] = useBoolean(false);

  const [isDragging, setIsDragging] = useBoolean(false);

  const [uploadStart, setUploadStart] = useBoolean(false);

  const handleInputClick = () => {
    const input = document.getElementById("fileInput")!;
    input.click();
  };

  const handleDelete = (id: string) => {
    setUploadProgresses((oldState) =>
      oldState.filter((progress) => progress.id !== id)
    );

    // ImageService.delete(id)
    //   .then(() => {
    //     setUploadProgresses((oldState) => [
    //       ...oldState.filter((progress) => progress.id !== id),
    //     ]);

    //     setBlockClose.off();
    //   })
    //   .catch((e) => {
    //     console.log(e);
    //   });
  };

  const clearCompletedFiles = () => {
    setUploadProgresses((oldState) =>
      oldState.filter((upload) => upload.sizeTransfered !== upload.totalSize)
    );
  };

  const handleSelectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearCompletedFiles();

    handleShowSelectedFiles(e.target.files!);

    //Exibir os arquivos selecionados no modal

    // uploadProgressesController(files);
  };

  const handleShowSelectedFiles = (files: FileList) => {
    const filesToArray: File[] = fileListToArray(files);

    if (isSizeExceded(filesToArray, 5)) {
      toast({
        title: "Tamanho inválido",
        description: "Tamanho do arquivo ultrapassou o limite",
        status: "error",
        duration: 4500,
        isClosable: true,
      });

      return;
    }

    if (
      !isValidTypeFiles(filesToArray, ["image/jpeg", "image/jpg", "image/png"])
    ) {
      toast({
        title: "Arquivo inválido",
        description: "Tipo inválido de aquivo foi inserido",
        status: "error",
        duration: 4500,
        isClosable: true,
      });

      return;
    }

    filesToArray.forEach((file) => {
      const uploadFileTask = ImageService.uploadWithProgress(file);

      // const id = ulid();

      const progress: UploadProgress = {
        id: ulid(),
        name: `${file.name}`,
        sizeTransfered: 0,
        totalSize: file.size,
        state: "notStarted",
        task: uploadFileTask,
      };

      setUploadProgresses((oldState) => [...oldState, { ...progress }]);
    });
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    handleShowSelectedFiles(e.dataTransfer.files!);

    setIsDragging.off();
  };

  const handleModalClose = () => {
    for (let i = 0; i < uploadProgresses.length; i++) {
      const currentUpload = uploadProgresses[i];
      if (currentUpload.state === "onGoing") {
        // setBlockClose.on();
        return;
      }
    }

    setUploadProgresses([]);

    onClose();
  };

  const setUploadStateById = (id: string, newState: UploadProgress) => {
    setUploadProgresses((oldState) =>
      oldState.map((uploadProgress) => {
        if (uploadProgress.id === id) {
          const state = {
            ...uploadProgress,
            sizeTransfered:
              newState.sizeTransfered ?? uploadProgress.sizeTransfered,
            totalSize: newState.totalSize ?? uploadProgress.totalSize,
            state: newState.state ?? uploadProgress.state,
            task: newState.task ?? uploadProgress.task,
          };

          return state;
        }

        return uploadProgress;
      })
    );
  };

  const isAllFilesCompleted = () => {
    for (let i = 0; i < uploadProgresses.length; i++) {
      const current = uploadProgresses[i];

      if (current.sizeTransfered !== current.totalSize) {
        return false;
      }
    }

    return true;
  };

  const handleSave = () => {
    if (uploadProgresses.length === 0) {
      return;
    }

    if (isAllFilesCompleted()) {
      toast({
        title: "Nenhum arquivo para enviar",
        description: "Todos os arquivos já foram enviados",
        status: "error",
        duration: 2000,
        isClosable: true,
      });

      return;
    }

    uploadProgresses.forEach(async (upload) => {
      const task = upload.task;

      const existImage: boolean | undefined =
        await ImageService.checkIfImageExists(task.snapshot.ref.name);

      if ((existImage === undefined) || (existImage === true)) {
        toast({
          title: "Nome duplicado",
          description: `O arquivo ${hidePartOfText(
            upload.name,
            7,
            7
          )} é duplicado`,
          status: "warning",
          duration: 2000,
          isClosable: true,
        });

        setUploadProgresses((oldState) =>
          oldState.filter((uploadProgress) => uploadProgress.id !== upload.id)
        );

        return;
      }

      task.on(
        "state_changed",
        (snapshot) => {
          const newState: UploadProgress = {
            ...upload,
            sizeTransfered: snapshot.bytesTransferred,
            totalSize: snapshot.totalBytes,
            state: "onGoing",
          };

          console.log("state is changing");

          setUploadStateById(upload.id, newState);
        },
        (error) => {
          handleDelete(upload.id);

          toast({
            title: "Upload Error",
            description: error.message,
            status: "error",
            duration: 9000,
            isClosable: true,
          });

        },
        async () => {
          //Verificando se o estado estando em success e o total de bytes transferidos for 0, se significa q o
          //usuário ja tem a imagem salva e por isso eu nn vou criar um novo documento e ainda vou remover do array

          //GEt the url of the image from the reference
          const imageUrl = await ImageService.downloadUrl(task.snapshot.ref);

          //Create an document with the url of the image from the firestore
          await ImageService.createDocument({
            id: upload.id,
            name: upload.name,
            "image-url": imageUrl,
          } as IImage);


          toast({
            title: `${hidePartOfText(upload.name, 7, 7)}`,
            status: "success",
            duration: 2000,
            isClosable: true,
          });

          setUploadStateById(upload.id, {
            state: "finished",
            sizeTransfered: task.snapshot.totalBytes,
          } as UploadProgress);
        }
      );
    });
  };

  useEffect(() => {
    for (let i = 0; i < uploadProgresses.length; i++) {
      const currentUpload = uploadProgresses[i];
      if (currentUpload.state === "onGoing") {
        setBlockClose.on();
        return;
      }
    }

    setBlockClose.off();
  }, [uploadProgresses, setBlockClose]);

  return (
    <Modal
      isOpen={blockClose ? true : isOpen}
      onClose={handleModalClose}
      size={{ base: "base", sm: "sm", md: "md" }}
    >
      <ModalOverlay />
      <ModalContent border={"2px solid yellow"}>
        <ModalHeader>
          <Text fontSize={20}>Upload images</Text>
          <Text fontSize={14}>Selecione as imagens para subir</Text>
        </ModalHeader>
        <ModalBody>
          <FormControl>
            <Input
              id="fileInput"
              type="file"
              accept={".png, .jpg, .jpeg"}
              multiple
              display={"none"}
              onChange={handleSelectFiles}
            />
          </FormControl>
          <Flex
            id="draggableFile"
            border={"2px solid black"}
            borderRadius={"lg"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
            padding={".5rem"}
            gap={".4rem"}
            onClick={handleInputClick}
            cursor={"pointer"}
            _hover={{ borderStyle: "dashed" }}
            borderStyle={isDragging ? "dashed" : "solid"}
            onDrop={handleFileDrop}
            onDragEnter={setIsDragging.on}
            onDragLeave={setIsDragging.off}
          >
            <UploadIcon boxSize={59} />
            Arraste os arquivos
            <Button>Selecionar os arquivos</Button>
          </Flex>
          <Text fontSize={13}>Tamanho máximo do arquivo 5mb.</Text>
          <Stack
            justifySelf={"center"}
            overflowY={"scroll"}
            boxSize={240}
            alignItems={"center"}
            w={"100%"}
            marginTop={2}
          >
            {uploadProgresses.map((item) => (
              <FileItem
                name={item.name}
                sizeTransfered={item.sizeTransfered}
                totalSize={item.totalSize}
                key={item.id}
                id={item.id}
                handleDelete={handleDelete}
                blockModal={setBlockClose}
                state={item.state}
                task={item.task}
                handleUploadChange={setUploadProgresses}
                uploadStart={uploadStart}
              />
            ))}
          </Stack>
          <Flex justifyContent={"center"} gap={2}>
            <Button w={"100%"} bgColor={"green"} onClick={handleSave}>
              Salvar
            </Button>
            <Button w={"100%"} bgColor={"red"} onClick={handleModalClose}>
              Fechar
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
