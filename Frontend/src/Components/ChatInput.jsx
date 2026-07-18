import { useState } from "react";
import {
  Code2,
  Globe,
  LoaderCircle,
  MessageSquare,
  Send,
  Zap,
} from "lucide-react";
import { sendMessage } from "../Features/sendMessage";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../Redux/messageSlice";
import { createConversation } from "../Features/createConversation";
import {
  addconversation,
  setSelectedConversation,
} from "../Redux/conversation.Slice";
import { updateConversation } from "../Features/updateConversation";
import { setArtifact } from "../Redux/artifactSlice";
import { createArtifactFromResponse } from "../Features/artifactTemplates";

const agents = [
  {
    id: "auto",
    icon: Zap,
    label: "Auto",
  },
  {
    id: "chat",
    icon: MessageSquare,
    label: "Chat",
  },
  {
    id: "coding",
    icon: Code2,
    label: "Coding",
  },
  {
    id: "search",
    icon: Globe,
    label: "Search",
  },
];

function ChatInput({ isResponding, setRespondingConversationId }) {
  const [value, setValue] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("Auto");
  const dispatch = useDispatch();
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { messages } = useSelector((state) => state.message);
  const canSend = value.trim().length > 0 && !isResponding;

  const handleSendMessage = async () => {
    if (!canSend) return;

    const prompt = value.trim();
    setValue("");
    setRespondingConversationId("creating");

    try {
      let activeConversation = selectedConversation;

      if (!activeConversation?._id) {
        activeConversation = await createConversation();

        if (!activeConversation?._id) return;

        const title = prompt.slice(0, 40);

        activeConversation = {
          ...activeConversation,
          title,
        };

        dispatch(addconversation(activeConversation));
        dispatch(setSelectedConversation(activeConversation));
        await updateConversation({ id: activeConversation._id, title });
      }

      setRespondingConversationId(activeConversation._id);

      const userMessage = {
        _id: `user-${Date.now()}`,
        conversationId: activeConversation._id,
        role: "user",
        content: prompt,
      };
      const nextMessages = [...messages, userMessage];

      const payload = {
        prompt,
        conversationId: activeConversation._id,
        agent: selectedAgent.toLowerCase(),
      };

      dispatch(setMessages(nextMessages));

      const data = await sendMessage(payload);

      if (!data) return;

      const assistantContent =
        typeof data === "string"
          ? data
          : data?.response || data?.content || data?.aiResponse;

      if (!assistantContent) return;

      const artifact = createArtifactFromResponse({
        prompt,
        response: assistantContent,
      });

      if (artifact) {
        dispatch(setArtifact(artifact));
      }

      dispatch(
        setMessages([
          ...nextMessages,
          {
            _id: `assistant-${Date.now()}`,
            conversationId: activeConversation._id,
            role: "assistant",
            content: assistantContent,
          },
        ]),
      );
    } finally {
      setRespondingConversationId(null);
    }
  };

  return (
    <div className="w-full shrink-0 border-t border-white/[0.06] bg-[#0d0f14]/95 px-3 py-3 backdrop-blur md:px-5 md:py-4">
      <div
        className={`mx-auto flex max-w-3xl flex-col gap-2 rounded-2xl border px-4 pt-3.5 pb-3 shadow-lg transition-all duration-200 ${
          isResponding
            ? "border-cyan-400/20 bg-cyan-400/[0.035] shadow-cyan-950/20"
            : "border-white/[0.08] bg-[#151821] shadow-black/20 focus-within:border-cyan-400/25 focus-within:bg-[#181b24]"
        }`}
      >
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={isResponding}
          placeholder={
            isResponding ? "AgentForge is responding..." : "Ask anything..."
          }
          className="max-h-36 min-h-16 w-full resize-none bg-transparent text-[14px] leading-relaxed text-slate-200 outline-none placeholder:text-slate-600 disabled:cursor-not-allowed disabled:opacity-55 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          rows={3}
        />
        <div className="flex items-end justify-between gap-3">
          <div className="flex w-[80%] flex-wrap items-center gap-2 pr-2">
            {agents.map((agent) => {
              const isActive = selectedAgent === agent.label;
              const Icon = agent.icon;

              return (
                <button
                  key={agent.id}
                  type="button"
                  disabled={isResponding}
                  onClick={() => setSelectedAgent(agent.label)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-45 ${
                    isActive
                      ? "border-cyan-400/25 bg-cyan-400/10 text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.10)]"
                      : "border-white/[0.07] bg-white/[0.03] text-slate-500 hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-slate-300"
                  }`}
                >
                  <Icon size={13} />
                  {agent.label}
                </button>
              );
            })}

          </div>
          <button
            disabled={!canSend}
            onClick={handleSendMessage}
            className={`flex h-9 w-9 items-center justify-center rounded-xl border-none text-white transition-all duration-150 ${
              canSend
                ? "cursor-pointer bg-linear-to-br from-cyan-500 to-indigo-600 shadow-[0_0_22px_rgba(34,211,238,0.18)] hover:-translate-y-0.5 hover:shadow-[0_0_28px_rgba(99,102,241,0.24)]"
                : "cursor-not-allowed bg-white/[0.06] text-slate-600"
            }`}
          >
            {isResponding ? (
              <LoaderCircle size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatInput;
