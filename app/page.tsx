import Image from "next/image";
import { Navigation } from "./components/Navigation";
import { HeaderUpcoming } from "./components/HeaderUpcoming";

export default function Home() {
  return (
    <div
      className=" bg-black
   flex  h-screen w-full flex-col items-center justify-start gap-10"
    >
      <div className="bg-black w-full h-14.75">
        <Navigation />
      </div>
      <div className="w-full h-150">
        <HeaderUpcoming />
      </div>
    </div>
  );
}
