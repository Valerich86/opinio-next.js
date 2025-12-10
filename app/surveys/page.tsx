import { Metadata } from "next";
import { Suspense } from "react";
import UserName from "../components/user-name";
import Loading from "../components/loading";
import SurveysList from "../components/all-surveys-list";
import { verifySession } from "@/app/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "/опросы",
};

export default async function Surveys() {
  // const user = await verifySession();
  // if (!user) redirect("/login");

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
