import { Metadata } from "next";
import { Suspense } from "react";
import { verifySession } from "../../lib/auth";
import { redirect } from "next/navigation";
import UserName from "../../components/UI/user-name";
import Loading from "../loading";
import SurveysList from "../../components/user-surveys-list";

export const metadata: Metadata = {
  title: "/профиль",
};

export default async function Profile() {
  const user = await verifySession();
  if (!user) redirect("/login");
  return (
    <>
      <div className="flex flex-col gap-10 w-screen min-h-[96vh] py-20 px-5 md:px-20">
        <Suspense>
          <UserName email={user?.email}/>
        </Suspense>
        <Suspense fallback={<Loading />}>
          <SurveysList userId={user?.userId}/>
        </Suspense>
      </div>
    </>
  );
}
