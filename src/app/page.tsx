import Image from "next/image";
import { EnterLink } from "../components/buttons";
import { headlineFont } from "../lib/fonts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "/главная | Opinio",
};

export default function Home() {
  return (
    <>
      <div className="absolute -z-30 w-screen h-screen flex items-center justify-center bg-neutral">
        <h1
          className={`${headlineFont.className} mb-[120px] text-2xl md:text-5xl text-center text-light w-[80%]`}
        >
          Простой и удобный сервис поможет вам создать опрос и провести
          исследование
        </h1>
      </div>
      <div className="flex w-screen h-screen items-center justify-center">
        <div className="flex flex-col justify-center items-center gap-20">
          <h1
            className={`${headlineFont.className} text-2xl md:text-5xl text-center text-light w-[80%]`}
          >
            Простой и удобный сервис поможет вам создать опрос и провести
            исследование
          </h1>
          <EnterLink />
        </div>
      </div>
    </>
  );
}
