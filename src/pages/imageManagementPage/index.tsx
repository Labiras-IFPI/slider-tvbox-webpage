import { useEffect, useState } from "react";
import {
  Button,
  Flex,
  Grid,
  Image,
  Stack,
  Text,
  useBoolean,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "./components/sortableItem";
import { Loading } from "../../shared/components/loading";
import { IImage } from "../../models/image";
import { isEqualArray } from "../../shared/utils/is_equal_array";
import { useForm, SubmitHandler, Form } from "react-hook-form";
import { UploadIcon } from "../../shared/icons";
import { UploadItemModal } from "./components/uploadItemModal";
import { ImageService } from "../../services/images_service";
import { ErrorPage } from "../../shared/components/errors";
import { sleep } from "../../shared/utils/sleep";

interface IImagesManagementPage {
  height: string;
}

export default function ImagesManagementPage({
  height,
}: IImagesManagementPage) {
  const [images, setImages] = useState<IImage[]>([]);
  const [oldImagesArray, setOldImagesArray] = useState<IImage[]>([]);
  const [isLoading, setIsLoading] = useBoolean(false);
  const [activeId, setActiveId] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  window.addEventListener("drop", (e) => {
    e.preventDefault();
  });
  window.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  const loadImages = async () => {
    setIsLoading.on();
    ImageService.getAll()
      .then((response) => {
        setImages(response);
        setOldImagesArray(response);

        setIsLoading.off();
      })
      .catch((e) => {
        setIsLoading.off();

        toast({
          title: "Error on load",
          description: "Error loading the application",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
  };

  useEffect(() => {
    const load = async () => {
      await loadImages();
    };

    load();
  }, []);

  useEffect(() => {
    if (isOpen === true) {
      return;
    }

    const load = async () => {
      await loadImages();
    };

    load();
  }, [isOpen]);

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<(typeof Image)[]>();

  const onSubmit: SubmitHandler<(typeof Image)[]> = async (mydata) => {
    await ImageService.overwriteAll(images).then(async () => {
      await sleep(2000, loadImages);
    });
    // .catch(async (e) => {
    //     toast({
    //       title: "Um erro aconteceu quando deletando",
    //       status: "error",
    //       duration: 9000,
    //       isClosable: true,
    //     })

    //     setIsLoading.on()

    //     // await ImageService.
    // })
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const getImageById = (id: string): IImage => {
    return images.filter((image) => image.id === id)[0];
  };

  const handleDragEnd = (event) => {
    setActiveId(null);
    const { active, over } = event;

    if (active.id !== over.id) {
      setImages((images) => {
        const oldIndex = images.indexOf(getImageById(active.id));
        const newIndex = images.indexOf(getImageById(over.id));

        return arrayMove(images, oldIndex, newIndex);
      });
    }
  };

  const handleCancel = () => {
    setImages(oldImagesArray);
  };

  const handleItemRemove = (id: string) => {
    setImages((oldState) => oldState.filter((value) => value.id !== id));
  };

  return (
    <form
      style={{
        display: "flex",
        width: "100%",
        // backgroundColor: "black",
        height,
        justifyContent: "center",
        overflowY: "auto",
        justifySelf: "center",
      }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
        <Stack w={"90%"} gap={6}>
          <Flex width={"100%"} marginTop={2}>
            <Text
              fontSize={20}
              display={"flex"}
              width={"100%"}
              textAlign={"start"}
              color={"white"}
            >
              Gerenciador de Imagens
            </Text>
            <Button bgColor={"yellow"} onClick={onOpen}>
              <Flex gap={".5rem"} alignItems={"center"}>
                Upload
                <UploadIcon />
              </Flex>
            </Button>
          </Flex>
          {isEqualArray(images, oldImagesArray) ? (
            <Flex gap={".5rem"} justifyContent={"end"}>
              <Button
                type="submit"
                bgColor={"green"}
                isLoading={isSubmitting}
                loadingText={"Salvando"}
              >
                Salvar
              </Button>
              <Button bgColor={"red"} onClick={handleCancel}>
                Cancelar
              </Button>
            </Flex>
          ) : null}
          {isLoading ? (
            <Loading
              display={"flex"}
              isIndeterminate
              color="yellow"
              w={"100%"}
              h={"50vh"}
              justifyContent={"center"}
              position={"relative"}
              alignItems={"center"}
            />
          ) : images.length === 0 ? (
            <ErrorPage
              message={
                "Imagens não foram carregadas, verifique sua conexão com a internet ou submeta uma nova imagem"
              }
            />
          ) : (
            <Grid
              gap={4}
              templateColumns={{
                base: "repeat(1, 1fr)",
                sm: "repeat(3, 1fr)",
                md: "repeat(4, 1fr)",
                lg: "repeat(5, 1fr)",
              }}
              width={"100%"}
              height={"100%"}
            >
              <SortableContext items={images} strategy={rectSortingStrategy}>
                {images.map((image) => (
                  <SortableItem
                    key={image.id}
                    id={image.id}
                    value={image}
                    handleRemove={handleItemRemove}
                  />
                ))}
                <DragOverlay>
                  {activeId ? (
                    <Image
                      width={"100%"}
                      height={"100%"}
                      borderRadius={"1.825rem"}
                      src={getImageById(activeId)["image-url"]}
                    />
                  ) : null}
                </DragOverlay>
              </SortableContext>
            </Grid>
          )}
        </Stack>
      </DndContext>

      <UploadItemModal onClose={onClose} isOpen={isOpen} />
    </form>
  );
}
