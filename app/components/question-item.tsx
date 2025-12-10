'use client';

import React, {useState} from "react";
import { Question, Answer } from "../lib/definitions";

interface QuestionItemProps {
  item: Question;
  answer: Answer;
  onAnswerChange: (answer: Answer) => void;
}

const QuestionItem: React.FC<QuestionItemProps> = React.memo(
  ({ item, answer, onAnswerChange }) => {
    const handleSingleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onAnswerChange({
        ...answer,
        single_value: e.target.value,
      });
    };

    const [hover, setHover] = useState<number | null>(null);

    const handleMultipleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const checked = e.target.checked;
      const newValues = checked
        ? [...answer.multiple_value, value]
        : answer.multiple_value.filter((v) => v !== value);

      onAnswerChange({
        ...answer,
        multiple_value: newValues,
      });
    };

    const handleFreeArrayChange = (
      e: React.ChangeEvent<HTMLInputElement>,
      index: number
    ) => {
      const value = e.target.value;
      const newValues = [...answer.multiple_value];
      newValues[index] = value;

      onAnswerChange({
        ...answer,
        multiple_value: newValues,
      });
    };

    const handleRatingChange = (value:number) => {
      onAnswerChange({
        ...answer,
        rating_value: value,
      });
    };


    const hiddenArray = [0, 1, 2];

    return (
      <div className="border-b border-b-gray-400 py-3">
        <div className="italic mb-5 flex flex-wrap gap-2 items-center">
          {`${item.sort_order}. ${item.text} (${item.type})`}
        </div>

        {/* Одиночный выбор */}
        {(item.type === "Одиночный выбор" ||
          item.type === "Шкала Лайкерта" ||
          item.type === "Логический") && (
          <ul className="list-disc flex flex-col gap-3">
            {item.answer_options?.map((answerOption, index) => (
              <li key={index}>
                <label>
                  <input
                    type="radio"
                    name={`radio-${item.id}`}
                    value={answerOption}
                    checked={answer.single_value === answerOption}
                    onChange={handleSingleChange}
                    className="w-4 h-4 accent-[#090C9B]"
                  />
                  <span className={`ml-2 text-dark`}>{answerOption}</span>
                </label>
              </li>
            ))}
          </ul>
        )}

        {/* Множественный выбор */}
        {item.type === "Множественный выбор" && (
          <ul className="list-disc flex flex-col gap-3">
            {item.answer_options?.map((answerOption, index) => (
              <li key={index}>
                <label>
                  <input
                    type="checkbox"
                    value={answerOption}
                    checked={answer.multiple_value.includes(answerOption)}
                    onChange={handleMultipleChange}
                    className="w-4 h-4 accent-[#090C9B]"
                  />
                  <span className="ml-2 text-dark">{answerOption}</span>
                </label>
              </li>
            ))}
          </ul>
        )}

        {/* Свободный ответ */}
        {item.type === "Свободный ответ" && (
          <input
            type="text"
            className="w-full rounded-md border border-gray-300 p-2 text-sm bg-white focus-input"
            value={answer.single_value}
            required
            onChange={handleSingleChange}
          />
        )}

        {/* 3 свободных ответа */}
        {item.type === "3 свободных ответа" && (
          <ul className="list-disc flex flex-col gap-3">
            {hiddenArray.map((index) => {
              const value = answer.multiple_value[index] ?? "";
              return (
                <li key={index}>
                  <input
                    type="text"
                    key={`free-${item.id}-${index}`}
                    className="w-full md:w-1/2 rounded-md border border-gray-300 p-2 text-sm bg-white focus-input"
                    value={value}
                    required
                    onChange={(e) => handleFreeArrayChange(e, index)}
                    placeholder={`Ответ ${index + 1}`}
                  />
                </li>
              );
            })}
          </ul>
        )}

        {/* шкала оценок */}
        {item.type === "Шкала оценок" && (
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, index) => {
              const ratingValue = index + 1;
              const isFilled = ratingValue <= (hover !== null ? hover : answer.rating_value);

              return (
                <button
                  key={index}
                  type="button"
                  className={`text-2xl focus:outline-none ${
                    isFilled ? "text-accent" : "text-gray-300"
                  }`}
                  onClick={() => handleRatingChange(ratingValue)}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(null)}
                  aria-label={`Поставить оценку ${ratingValue} из ${5}`}
                >
                  ★
                </button>
              );
            })}
            <input type="hidden" value={answer.rating_value} />
            <span className="ml-2 text-sm text-gray-600">
              {answer.rating_value} из {5}
            </span>
          </div>
        )}
      </div>
    );
  }
);

export default QuestionItem;
