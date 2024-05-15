export const fileListToArray = (fileList: FileList) => {
  const newArray: Array<File> = [];

  for (let i = 0; i < fileList.length; i++) {
    newArray.push(fileList[i]);
  }

  return newArray;
};
