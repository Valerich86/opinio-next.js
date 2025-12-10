import { Metadata } from "next";
import Loading from "../../components/loading";
import { Suspense } from "react";
import CompleteSurvey from "../../components/survey";
import { verifySession } from "@/app/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "/заполнение опроса",
};

export default async function SurveyCompleting(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const surveyId = params.id;
  const user = await verifySession();
  if (!user) redirect("/login");

  return (
    <div className="flex flex-col items-center justify-center w-screen py-20 px-5 md:px-20">
      <Suspense fallback={<Loading />}>
        <CompleteSurvey id={surveyId} userId={user?.userId}/>
      </Suspense>
    </div>
  );
}
