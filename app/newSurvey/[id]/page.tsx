import { Metadata } from "next";
import SurveyProgress from "../../components/survey-progress";
import QuestionForm from "../../components/question-form";
import { Suspense } from "react";
import Loading from "../../components/loading";

export const metadata: Metadata = {
  title: "/новый опрос/добавление вопросов",
};

export default async function NewQuestion(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const surveyId = params.id;

  return (
    <div className="flex flex-col items-center justify-center w-screen py-20 px-5 md:px-20">
      <Suspense>
        <SurveyProgress id={surveyId}/>
      </Suspense>
      <h1 className="text-xl text-center mt-10">Давайте добавим вопросы к анкете:</h1>
      <Suspense fallback={<Loading/>}>
        <QuestionForm id={surveyId}/>
      </Suspense>
    </div>
  );
}
