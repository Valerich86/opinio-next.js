import { Metadata } from "next";
import { Suspense } from "react";
import UserName from "../../components/UI/user-name";
import Loading from "../loading";
import SurveysList from "../../components/all-surveys-list";
import { verifySession } from "@/src/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "/опросы",
};

export default async function Surveys() {

  return (
    <>
      <div className="flex flex-col gap-10 items-center justify-center w-screen py-20 px-5 md:px-20">
        <Suspense fallback={<Loading />}>
          <SurveysList />
        </Suspense>
      </div>
      <div className="pt-20">
      </div>
    </>
  );
}
