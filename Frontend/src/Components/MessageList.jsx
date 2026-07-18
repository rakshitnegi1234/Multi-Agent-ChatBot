import { useEffect, useRef, useState } from "react";
import { Bot, MessageCircle, Sparkles, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../Utils/axios";
import { setMessages } from "../Redux/messageSlice";

const cleanMessageContent = (content) =>
  String(content || "").replace(/\*\*(.*?)\*\*/g, "$1");

function MessageList({ isResponding }) {
  const dispatch = useDispatch();
  const bottomRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { messages } = useSelector((state) => state.message);

  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedConversation?._id) {
        dispatch(setMessages([]));
        return;
      }

      try {
        setLoading(true);
        setError("");

        const { data } = await api.get(
          `/api/v1/chat/get-message/${selectedConversation._id}`,
        );

        dispatch(setMessages([...data].reverse()));
      } catch (err) {
        console.log(err);
        setError("Unable to load messages.");
        dispatch(setMessages([]));
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [dispatch, selectedConversation?._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isResponding]);

  if (!selectedConversation) {
    return (
      <div className="flex-1 flex items-center justify-center px-4 py-10 sm:px-6">
        <div className="flex w-full max-w-lg flex-col items-center gap-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 shadow-[0_0_34px_rgba(34,211,238,0.08)]">
            <Sparkles size={20} />
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-[24px] font-semibold text-slate-100 tracking-tight">
              AgentForge
            </h1>
            <p className="text-[15px] font-medium text-slate-300 tracking-tight">
              How can I help you?
            </p>
            <p className="mx-auto max-w-sm text-[13px] text-slate-500 leading-relaxed">
              Start with a question, a code problem, or an idea you want to
              shape into something useful.
            </p>
          </div>

          <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-3">
            {["Write a Netflix clone", "Explain Redis", "Build a dashboard"].map(
              (suggestion) => (
                <button
                  key={suggestion}
                  className="min-h-10 rounded-xl border border-white/[0.08] bg-white/[0.035] px-3 py-2 text-[12px] font-medium text-slate-400 transition-all duration-150 hover:-translate-y-0.5 hover:border-cyan-400/20 hover:bg-white/[0.07] hover:text-slate-200"
                >
                  {suggestion}
                </button>
              ),
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-3 py-5 sm:px-6 sm:py-7 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
        {loading && (
          <div className="flex items-center justify-center py-10 text-[13px] text-slate-500">
            <div className="flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.03] px-4 py-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" />
              Loading messages...
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-rose-400/15 bg-rose-400/10 px-4 py-3 text-center text-[13px] text-rose-300">
            {error}
          </div>
        )}

        {!loading && !error && messages.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-slate-500">
              <MessageCircle size={18} />
            </div>
            <div>
              <p className="text-[14px] font-medium text-slate-300">
                No messages yet
              </p>
              <p className="mt-1 text-[12px] text-slate-600">
                Send the first message to start this conversation.
              </p>
            </div>
          </div>
        )}

        {!loading &&
          !error &&
          messages.map((message) => {
            const isUser = message.role === "user";

            return (
              <div
                key={message._id}
                className={`group flex items-start gap-3 ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                {!isUser && (
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.08)]">
                    <Bot size={16} />
                  </div>
                )}

                <div
                  className={`max-w-[86%] rounded-2xl border px-4 py-3 text-[14px] leading-6 shadow-sm transition-colors duration-150 whitespace-pre-wrap break-words sm:max-w-[78%] ${
                    isUser
                      ? "rounded-tr-md border-indigo-400/20 bg-indigo-500 text-white shadow-indigo-950/20"
                      : "rounded-tl-md border-white/[0.08] bg-[#171a22] text-slate-200"
                  }`}
                >
                  {cleanMessageContent(message.content)}
                </div>

                {isUser && (
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.05] text-slate-400">
                    <User size={15} />
                  </div>
                )}
              </div>
            );
          })}

        {isResponding && (
          <div className="flex items-start gap-3 justify-start">
            <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 shadow-[0_0_22px_rgba(34,211,238,0.12)]">
              <Bot size={16} />
            </div>

            <div className="rounded-2xl rounded-tl-md border border-white/[0.08] bg-[#171a22] px-4 py-3 shadow-[0_0_24px_rgba(34,211,238,0.08)]">
              <div className="flex h-6 items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-bounce [animation-delay:-0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-bounce [animation-delay:-0.1s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-bounce" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}

export default MessageList;
