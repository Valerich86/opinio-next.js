import Image from "next/image";
import { EnterLink } from "./components/buttons";
import { headlineFont } from "./utilities/fonts";
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: '/главная | Opinio',
};

export default function Home() {
  return (
    <div className="flex w-screen h-screen items-center justify-center bg-[url(/main-page.jpeg)] bg-center md:bg-top-left bg-cover bg-no-repeat">
      <div className="dark-container"></div>
      <div className="flex flex-col justify-center items-center gap-10 mt-80 z-10">
        <h1
          className={`${headlineFont.className} text-2xl md:text-5xl text-center text-white w-[80%]`}
        >
          Простой и удобный сервис поможет вам создать опрос и провести исследование
        </h1>
        <EnterLink />
      </div>
    </div>
  );
}
