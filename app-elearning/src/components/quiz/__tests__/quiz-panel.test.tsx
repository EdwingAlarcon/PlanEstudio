import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Question } from "@/lib/quiz-engine";
import { QuizPanel } from "../quiz-panel";

const questions: Question[] = [
  {
    id: "module-1-0",
    moduleId: 1,
    type: "single",
    prompt: "Pregunta uno",
    options: ["Opción A1", "Opción B1"],
    answer: [0],
    explanation: "Explicación uno",
  },
  {
    id: "module-1-1",
    moduleId: 1,
    type: "single",
    prompt: "Pregunta dos",
    options: ["Opción A2", "Opción B2"],
    answer: [1],
    explanation: "Explicación dos",
  },
];

describe("QuizPanel — feedback screen", () => {
  it("keeps showing the question just answered (not the next one) during feedback", () => {
    // startQuiz shuffles the session, so don't assume question order — capture
    // whichever question renders first, then confirm it (not the other one) is what
    // the feedback screen shows.
    render(<QuizPanel questions={questions} moduleId="test" saveScore={false} />);

    fireEvent.click(screen.getByRole("button", { name: /iniciar evaluación/i }));

    const firstPrompt = questions.find((q) => screen.queryByText(q.prompt))!;
    const secondPrompt = questions.find((q) => q.id !== firstPrompt.id)!;

    fireEvent.click(screen.getByRole("button", { name: new RegExp(firstPrompt.options[0]!, "i") }));
    fireEvent.click(screen.getByRole("button", { name: /enviar respuesta/i }));

    // Regression: currentQuestion advances to the next unanswered question as soon as
    // recordAttempt runs, so the feedback screen must render lastAttempt.question instead.
    expect(screen.getByText(firstPrompt.prompt)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(firstPrompt.options[1]!))).toBeInTheDocument();
    expect(screen.queryByText(secondPrompt.prompt)).not.toBeInTheDocument();
    expect(screen.getByText(new RegExp(firstPrompt.explanation))).toBeInTheDocument();
  });
});
