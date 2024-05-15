import {
  CircularProgress,
  CircularProgressProps,
} from "@chakra-ui/react";

export const Loading = (props: CircularProgressProps) => {
  return (
      <CircularProgress
        {...props}
      />
  );
};
