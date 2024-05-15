import { Icon, IconProps } from "@chakra-ui/react";
import { IoMdLogOut } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { IoCloudUploadOutline } from "react-icons/io5";
import { FaFile } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { LuDot } from "react-icons/lu";
import { GrClose } from "react-icons/gr";
import { FcGoogle } from "react-icons/fc";
import { IoWarningOutline } from "react-icons/io5";

export function LogoutIcon(props: IconProps) {
  return <Icon as={IoMdLogOut} {...props} />;
}

export function UserIcon(props: IconProps) {
  return <Icon as={FaUserCircle} {...props} />;
}

export function UploadIcon(props: IconProps) {
  return <Icon as={IoCloudUploadOutline} {...props} />;
}
export function DeleteIcon(props: IconProps) {
  return <Icon as={MdDelete} {...props} />;
}
export function FileIcon(props: IconProps) {
  return <Icon as={FaFile} {...props} />;
}
export function DotIcon(props: IconProps) {
  return <Icon as={LuDot} {...props} />;
}
export function RemoveIcon(props: IconProps) {
  return <Icon as={GrClose} {...props} />;
}

export function WarngingIcon(props: IconProps) {
  return <Icon as={IoWarningOutline} {...props} />;
}

export function GoogleIcon(props: IconProps) {
  return <Icon as={FcGoogle} {...props} />;
}
