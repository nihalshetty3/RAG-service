import { useState } from "react";
import Message from "./Message";
import { searchDocuments } from "../services/api";

const formatTitle = (doc_id) => {
  if (!doc_id) return "Untitled";
  return doc_id
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
    .replace(/\s(Chunk|Vec|Id)\s?\d*/gi, "")
    .trim();
};

function ChatArea({ setSelectedDoc }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Ask me anything about your documents.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userQuery = input;
    setInput("");

    setMessages((prev) => [...prev, { role: "user", content: userQuery }]);


    setLoading(true);

    try {
      const data = await searchDocuments(userQuery);

      const normalizedSources = (data.sources || []).slice(0, 3).map((s) => ({
        title: formatTitle(s.doc_id),
        source: s.doc_path || "Unknown",
        path: s.doc_path || "",
        content: s.chunk_text || "No content available.",
        url: s.url || null,
        similarity: s.similarity ?? null,
      }));

      const answerWithConfidence = `
${data.answer || "No answer returned."}

Confidence Score: ${data.confidence_score ?? "N/A"}%
      `.trim();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: answerWithConfidence,
          sources: normalizedSources,
        },
      ]);
    } catch (err) {
      console.error("Search failed:", err);
      
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
          sources: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="chat-area">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index}>
            <Message message={msg} onCiteClick={setSelectedDoc} />
          </div>
        ))}
        {loading && (
          <div className="message assistant">
            <p>Searching documents...</p>
          </div>
        )}
      </div>
      <div className="chat-input">
        <input
          value={input}
          placeholder="Ask a question..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading}>
          {loading ? "Searching..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default ChatArea;
