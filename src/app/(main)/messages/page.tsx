import { Metadata } from "next";
import Chat from "./Chat";

export const metadata: Metadata = {
  title: "Mensajes",
};

export default function Page() {
  return <Chat />;
}
