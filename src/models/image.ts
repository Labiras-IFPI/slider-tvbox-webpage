import { Timestamp } from "firebase/firestore";

export interface IImage {
  id: string;
  name: string;
  "image-url": string;
  updatedAt: Timestamp;
}
