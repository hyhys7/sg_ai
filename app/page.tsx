"use client";

import { useState } from "react";

type ChatMessage = { role: "user" | "assistant"; content: string };
type FollowUp = { question: string; answer: string };

async function callChat(messages: ChatMessage[], mode: "question" | "answer") {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, mode }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || !data) {
    throw new Error(data?.error ?? "서버와 통신하지 못했습니다. 잠시 후 다시 시도해주세요.");
  }

  return data as { reply: string };
}

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [finalAnswer, setFinalAnswer] = useState<string | null>(null);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [followUpInput, setFollowUpInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const data = await callChat(nextMessages, "question");
      setMessages([...nextMessages, { role: "assistant", content: data.reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  async function getAnswer() {
    if (messages.length === 0 || loading) return;
    setLoading(true);
    setError(null);

    try {
      const data = await callChat(messages, "answer");
      setFinalAnswer(data.reply);
    } catch (e) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  async function askFollowUp() {
    const text = followUpInput.trim();
    if (!text || loading || finalAnswer === null) return;

    const history: ChatMessage[] = [
      ...messages,
      { role: "assistant", content: finalAnswer },
      ...followUps.flatMap((f): ChatMessage[] => [
        { role: "user", content: f.question },
        { role: "assistant", content: f.answer },
      ]),
      { role: "user", content: text },
    ];

    setFollowUpInput("");
    setLoading(true);
    setError(null);

    try {
      const data = await callChat(history, "answer");
      setFollowUps([...followUps, { question: text, answer: data.reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setMessages([]);
    setFinalAnswer(null);
    setFollowUps([]);
    setFollowUpInput("");
    setError(null);
  }

  const myThoughts = messages
    .filter((m) => m.role === "user")
    .map((m) => m.content)
    .join("\n\n");

  const errorBanner = error && <p className="error-banner">{error}</p>;

  if (finalAnswer !== null) {
    return (
      <main className="container container--wide">
        <h1>내 생각 vs AI 답변</h1>
        <div className="compare-grid">
          <section className="compare-card">
            <h2>내가 쌓아온 생각</h2>
            <p>{myThoughts}</p>
          </section>
          <section className="compare-card">
            <h2>AI 답변</h2>
            <p>{finalAnswer}</p>
          </section>
        </div>

        {followUps.length > 0 && (
          <div className="followups">
            {followUps.map((f, i) => (
              <div key={i}>
                <p className="followup-q">Q. {f.question}</p>
                <p className="followup-a">{f.answer}</p>
              </div>
            ))}
          </div>
        )}

        <div className="input-row" style={{ marginTop: "1.5rem" }}>
          <input
            className="text-input"
            value={followUpInput}
            onChange={(e) => setFollowUpInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && askFollowUp()}
            placeholder="추가로 궁금한 걸 물어보세요"
          />
          <button onClick={askFollowUp} disabled={loading || !followUpInput.trim()}>
            질문하기
          </button>
        </div>
        {loading && <p className="typing">...</p>}
        {errorBanner}

        <button className="secondary" onClick={reset} style={{ marginTop: "2rem", alignSelf: "flex-start" }}>
          새로 시작하기
        </button>
      </main>
    );
  }

  return (
    <main className="container">
      <h1>sgprojectastar</h1>
      <p className="subtitle">궁금한 걸 물어보세요. AI가 곧바로 답하지 않고 되물으며 생각을 끌어냅니다.</p>

      <div className="chat-log">
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.role === "user" ? "bubble--user" : "bubble--assistant"}`}>
            {m.content}
          </div>
        ))}
        {loading && <p className="typing">...</p>}
      </div>

      {errorBanner}

      <div className="input-row">
        <input
          className="text-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="궁금한 걸 입력하세요"
        />
        <button onClick={sendMessage} disabled={loading}>
          보내기
        </button>
      </div>

      <button className="answer-btn" onClick={getAnswer} disabled={messages.length === 0 || loading}>
        답변 받아보기
      </button>
    </main>
  );
}
