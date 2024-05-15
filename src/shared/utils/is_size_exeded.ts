export const isSizeExceded = (files: File[], sizeLimit: number) => {
  const limit = sizeLimit * 10 ** 6;
  for (let i = 0; i < files.length; i++) {
    const currentFile = files[i];

    if (currentFile.size > limit) {
      return true;
    }
  }

  return false;
};
