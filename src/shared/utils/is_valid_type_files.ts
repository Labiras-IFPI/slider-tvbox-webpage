type FileType = "image/png" | "image/jpg" | "image/jpeg";

export const isValidTypeFiles = (
  files: File[],
  fileTypes: FileType[]
): boolean => {
  //Para cada arquivo
  for (let i = 0; i < files.length; i++) {
    const currentFile = files[i];

    if (!fileTypes.find((type) => type === currentFile.type)) {
      return false;
    }
  }

  return true;
};
