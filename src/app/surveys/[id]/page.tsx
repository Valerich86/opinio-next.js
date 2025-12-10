import { Metadata } from "next";
import Loading from "../../loading";
import { Suspense } from "react";
import { verifySession } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import SurveyStats from "@/src/components/survey-stats";
import ChartsList from "@/src/components/question-charts-list";

export const metadata: Metadata = {
  title: "/статистика опроса",
};

export default async function SurveyInfo(props: {
  params: Promise<{ id: string }>;
}) {
  const {id} = await props.params;
  const user = await verifySession();
  if (!user) redirect("/login");

  return (
    <div className="flex flex-col gap-y-10 w-screen py-20 px-5 md:px-30">
      <Suspense fallback={<Loading />}>
        <SurveyStats surveyId={id}/>
      </Suspense>
      <Suspense fallback={<Loading />}>
        <ChartsList id={id} />
      </Suspense>
    </div>
  );
}
