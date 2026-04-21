import Image from "next/image";
import { Navigation } from "./components/Navigation";
import { HeaderUpcoming } from "./components/HeaderUpcoming";
import { Upcomingcomps } from "./components/Upcomingcomps";
const PRODUCTS_PER_PAGE = 12;
export default function Home() {
  return (
    <div
      className=" bg-black
   flex  h-screen
    w-full flex-col items-center justify-start gap-10"
    >
      <div className="bg-black w-full h-14.75">
        <Navigation />
      </div>
      <div className="w-full h-150">
        <HeaderUpcoming />
      </div>
      <div className="py-50 w-full h-100 flex flex-col items-start justify-start gap-4">
        <Upcomingcomps />
      </div>
    </div>
  );
}
