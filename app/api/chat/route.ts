import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

type ChatMessage = { role: "user" | "assistant"; content: string };

const QUESTION_SYSTEM_PROMPT = `당신은 사용자가 AI에게 답을 구하기 전에 스스로 생각을 정리하도록 돕는 대화 파트너입니다.

- 사용자가 무엇을 묻든 곧바로 답을 주지 마세요.
- 대신 사용자가 자신의 상황, 전제, 진짜 궁금한 지점을 스스로 구체화할 수 있도록 되묻는 질문을 하세요.
- 사용자가 짧고 성의 없이 답하더라도 다그치지 말고, 자연스럽게 다음 질문으로 생각을 넓혀가세요.
- 한 번에 한 가지 질문만 하세요. 질문은 짧고 명확하게.
- 평가하거나 점수를 매기지 마세요. 옳고 그름을 판단하지 마세요.
- 사용자가 스스로 답에 가까워지고 있다면, 그 흐름을 인정하며 한 걸음 더 나아가는 질문을 하세요.`;

const ANSWER_SYSTEM_PROMPT = `지금까지의 대화를 참고하여, 사용자의 마지막 질문에 대한 명확하고 직접적인 답변을 제공하세요.

- 대화에서 드러난 사용자의 맥락과 생각을 반영하세요.
- 서론 없이 바로 핵심 답변부터 제시하세요.
- 평가나 점수는 포함하지 마세요.`;

export async function POST(req: NextRequest) {
  const { messages, mode } = (await req.json()) as {
    messages: ChatMessage[];
    mode: "question" | "answer";
  };

  if (!messages || messages.length === 0) {
    return NextResponse.json({ error: "messages is required" }, { status: 400 });
  }

  const systemInstruction = mode === "answer" ? ANSWER_SYSTEM_PROMPT : QUESTION_SYSTEM_PROMPT;

  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  // Gemini requires the conversation to end on a user turn. "answer" mode is
  // triggered after the AI's last turn (a follow-up question), so append a
  // synthetic trailing user turn requesting the final answer.
  if (mode === "answer" && contents[contents.length - 1]?.role !== "user") {
    contents.push({
      role: "user",
      parts: [{ text: "지금까지의 대화를 바탕으로 답변해 주세요." }],
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents,
      config: { systemInstruction },
    });

    return NextResponse.json({ reply: response.text ?? "" });
  } catch (err) {
    const status = (err as { status?: number })?.status ?? 500;
    const message =
      status === 429
        ? "요청이 너무 많아 잠시 제한되었습니다. 잠시 후 다시 시도해주세요."
        : "답변을 가져오지 못했습니다. 잠시 후 다시 시도해주세요.";
    console.error("Gemini API error:", err);
    return NextResponse.json({ error: message }, { status: status === 429 ? 429 : 502 });
  }
}
