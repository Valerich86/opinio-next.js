import SurveyForm from "../../components/survey-form";
import { Metadata } from "next";
import { verifySession } from "../../lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "/новый опрос",
};

export default async function NewSurvey() {
  const user = await verifySession();
  if (!user) redirect("/login");
  return (
    <div className="flex flex-col items-center justify-center w-screen pt-40">
      <h1 className="text-2xl">Введите название опроса</h1>
      <SurveyForm userId={user?.userId}/>
    </div>
  );
}
