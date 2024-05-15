import { UploadTask } from "firebase/storage";

export interface UploadProgress {
  id: string;
  name: string;
  sizeTransfered: number;
  totalSize: number;
  state: "notStarted" | "onGoing" | "finished";
  uploadUrl?: string;
  task: UploadTask;
}
