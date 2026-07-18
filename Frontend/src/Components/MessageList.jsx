import { useEffect, useRef, useState } from "react";
import {
  Bot,
  CheckSquare,
  Clock,
  Database,
  MessageCircle,
  Sparkles,
  User,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../Utils/axios";
import { setMessages } from "../Redux/messageSlice";
import { setArtifact } from "../Redux/artifactSlice";
import {
  createArtifactChatMessage,
  createArtifactFromResponse,
  stripPreviewableCode,
} from "../Features/artifactTemplates";

const codeBlockRegex = /```([a-z0-9.+-]*)?[ \t]*\n?([\s\S]*?)```/gi;

const keywordRegex =
  /\b(async|await|break|case|catch|class|const|continue|default|else|export|for|from|function|if|import|let|new|null|return|switch|throw|try|undefined|while)\b/g;

const renderInline = (text) =>
  String(text || "")
    .split(/(`[^`]+`|\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part, index) => {
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={`${part}-${index}`}
            className="rounded-md bg-white/[0.07] px-1.5 py-0.5 font-mono text-[0.92em] text-cyan-100"
          >
            {part.slice(1, -1)}
          </code>
        );
      }

      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong
            key={`${part}-${index}`}
            className="font-semibold text-slate-100"
          >
            {part.slice(2, -2)}
          </strong>
        );
      }

      return part;
    });

const splitTableRow = (line) => {
  const trimmed = String(line || "").trim();
  const withoutEdges = trimmed.replace(/^\|/, "").replace(/\|$/, "");

  return withoutEdges.split("|").map((cell) => cell.trim());
};

const isTableSeparator = (line) =>
  /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(
    String(line || "").trim(),
  );

const normalizeMarkdownLines = (text) => {
  const lines = String(text || "").split("\n");
  const normalized = [];

  for (let index = 0; index < lines.length; index += 1) {
    const current = lines[index].trim();
    const next = lines[index + 1]?.trim();

    if (/^\d+[.)]$/.test(current) && next) {
      normalized.push(`${current} ${next}`);
      index += 1;
      continue;
    }

    normalized.push(lines[index]);
  }

  return normalized;
};

const renderMarkdownTable = ({ header, rows, key }) => (
  <div
    key={key}
    className="my-3 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0d1118]"
  >
    <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <table className="min-w-full border-collapse text-left text-[12.5px] leading-5">
        <thead>
          <tr className="border-b border-white/[0.08] bg-white/[0.035]">
            {header.map((cell, index) => (
              <th
                key={`${cell}-${index}`}
                className="px-3 py-2.5 font-semibold text-cyan-100"
              >
                {renderInline(cell)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-white/[0.055] last:border-b-0 hover:bg-white/[0.025]"
            >
              {header.map((_cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="align-top px-3 py-2.5 text-slate-300"
                >
                  {renderInline(row[cellIndex] || "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const highlightCode = (code) =>
  String(code || "")
    .split(/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\/\/.*|\b\d+(?:\.\d+)?\b)/g)
    .filter((part) => part !== "")
    .map((part, index) => {
      let className = "text-slate-100";

      if (/^["'`]/.test(part)) {
        className = "text-emerald-300";
      } else if (/^\/\//.test(part)) {
        className = "text-slate-500";
      } else if (/^\d/.test(part)) {
        className = "text-amber-300";
      }

      const pieces = part.split(keywordRegex).filter((piece) => piece !== "");

      return pieces.map((piece, pieceIndex) => (
        <span
          key={`${index}-${pieceIndex}`}
          className={
            /\b(async|await|break|case|catch|class|const|continue|default|else|export|for|from|function|if|import|let|new|null|return|switch|throw|try|undefined|while)\b/.test(
              piece,
            )
              ? "text-violet-300"
              : className
          }
        >
          {piece}
        </span>
      ));
    });

const renderTextBlock = (text) => {
  const lines = normalizeMarkdownLines(text);
  const elements = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      elements.push(<div key={index} className="h-3" />);
      continue;
    }

    const nextLine = lines[index + 1];
    if (trimmed.includes("|") && isTableSeparator(nextLine)) {
      const header = splitTableRow(trimmed);
      const rows = [];
      index += 2;

      while (index < lines.length && lines[index].trim().includes("|")) {
        rows.push(splitTableRow(lines[index]));
        index += 1;
      }

      index -= 1;
      elements.push(
        renderMarkdownTable({ header, rows, key: `table-${index}` }),
      );
      continue;
    }

    const heading = trimmed.match(/^(#{1,3})\s+(.+)/);
    if (heading) {
      elements.push(
        <h3
          key={index}
          className="mt-2 text-[15px] font-semibold leading-6 text-slate-100 first:mt-0"
        >
          {renderInline(heading[2])}
        </h3>,
      );
      continue;
    }

    const listItem = trimmed.match(/^[-*]\s+(.+)/);
    if (listItem) {
      elements.push(
        <div key={index} className="flex gap-2">
          <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300/70" />
          <p className="min-w-0">{renderInline(listItem[1])}</p>
        </div>,
      );
      continue;
    }

    const numberedItem = trimmed.match(/^\d+[.)]\s+(.+)/);
    if (numberedItem) {
      elements.push(
        <div key={index} className="flex gap-2">
          <span className="min-w-5 shrink-0 text-right font-medium text-cyan-300/80">
            {trimmed.split(/[.)]/)[0]}.
          </span>
          <p className="min-w-0">{renderInline(numberedItem[1])}</p>
        </div>,
      );
      continue;
    }

    elements.push(
      <p key={index} className="leading-6">
        {renderInline(trimmed)}
      </p>,
    );
  }

  return elements;
};

const renderMessageContent = (content) => {
  const visibleContent = stripPreviewableCode(content);
  const parts = [];
  let lastIndex = 0;

  for (const match of visibleContent.matchAll(codeBlockRegex)) {
    if (match.index > lastIndex) {
      parts.push({
        type: "text",
        value: visibleContent.slice(lastIndex, match.index),
      });
    }

    parts.push({
      type: "code",
      language: match[1] || "code",
      value: match[2].trim(),
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < visibleContent.length) {
    parts.push({ type: "text", value: visibleContent.slice(lastIndex) });
  }

  return parts.map((part, index) => {
    if (part.type === "code") {
      return (
        <div
          key={index}
          className="my-3 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0a0d12]"
        >
          <div className="border-b border-white/[0.07] px-3 py-2 font-mono text-[11px] uppercase text-slate-500">
            {part.language}
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-[12.5px] leading-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <code>{highlightCode(part.value)}</code>
          </pre>
        </div>
      );
    }

    return (
      <div key={index} className="space-y-1.5">
        {renderTextBlock(part.value)}
      </div>
    );
  });
};

const promptSuggestions = [
  {
    label: "Build a todo",
    prompt: "Build a todo app",
    icon: CheckSquare,
  },
  {
    label: "Explain Redis",
    prompt: "Explain Redis",
    icon: Database,
  },
  {
    label: "Top 5 goated anime",
    prompt: "Give me top 5 goated anime",
    icon: Clock,
  },
];

function MessageList({ isResponding, onSuggestionSelect }) {
  const dispatch = useDispatch();
  const bottomRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { messages } = useSelector((state) => state.message);
  const { dismissedByConversation } = useSelector((state) => state.artifact);

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
        const orderedMessages = [...data].sort(
          (first, second) =>
            new Date(first.createdAt).getTime() -
            new Date(second.createdAt).getTime(),
        );
        const dismissedAt =
          dismissedByConversation[selectedConversation._id] || 0;

        for (let index = orderedMessages.length - 1; index >= 0; index -= 1) {
          const message = orderedMessages[index];

          if (message.role !== "assistant") continue;

          if (new Date(message.createdAt).getTime() <= dismissedAt) {
            continue;
          }

          const prompt =
            [...orderedMessages]
              .slice(0, index)
              .reverse()
              .find((item) => item.role === "user")?.content || "";
          const artifact = createArtifactFromResponse({
            prompt,
            response: message.content,
          });

          if (artifact) {
            dispatch(
              setArtifact({
                artifact,
                conversationId: selectedConversation._id,
              }),
            );
            break;
          }
        }

        dispatch(setMessages(orderedMessages));
      } catch (err) {
        console.log(err);
        setError("Unable to load messages.");
        dispatch(setMessages([]));
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [dispatch, dismissedByConversation, selectedConversation?._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isResponding]);

  if (!selectedConversation) {
    return (
      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-8 sm:px-6 sm:py-10">
        <div className="surface-pop flex w-full max-w-2xl flex-col items-center gap-6 text-center sm:gap-7">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/25 bg-cyan-300/10 text-cyan-200 shadow-[0_0_44px_rgba(34,211,238,0.13)]">
            <span className="absolute inset-1 rounded-[14px] border border-white/[0.07]" />
            <Sparkles size={20} />
          </div>

          <div className="flex max-w-lg flex-col gap-2">
            <h1 className="text-[26px] font-semibold text-slate-100 sm:text-[28px]">
              AgentForge
            </h1>
            <p className="text-[15px] font-medium text-slate-300">
              How can I help you?
            </p>
          </div>

          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
            {promptSuggestions.map((suggestion) => {
              const Icon = suggestion.icon;

              return (
                <button
                  key={suggestion.label}
                  type="button"
                  onClick={() => onSuggestionSelect?.(suggestion.prompt)}
                  className="group flex min-h-14 cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.035] px-3 py-3 text-[12.5px] font-medium text-slate-300 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-cyan-300/25 hover:bg-cyan-300/[0.07] hover:text-cyan-100 hover:shadow-[0_0_26px_rgba(34,211,238,0.08)] active:translate-y-0"
                >
                  <Icon
                    size={15}
                    className="text-slate-500 transition-colors duration-150 group-hover:text-cyan-200"
                  />
                  <span>{suggestion.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 flex-1 overflow-y-auto px-3 py-4 sm:px-6 sm:py-7 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
          messages.map((message, index) => {
            const isUser = message.role === "user";
            const prompt =
              !isUser &&
              [...messages]
                .slice(0, index)
                .reverse()
                .find((item) => item.role === "user")?.content;
            const artifact =
              !isUser &&
              createArtifactFromResponse({
                prompt,
                response: message.content,
              });
            const visibleContent = artifact
              ? createArtifactChatMessage({
                  prompt,
                  response: message.content,
                  artifact,
                })
              : message.content;

            return (
              <div
                key={message._id}
                className={`message-enter group flex items-start gap-2.5 sm:gap-3 ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                {!isUser && (
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.08)]">
                    <Bot size={16} />
                  </div>
                )}

                <div
                  className={`rounded-2xl border px-3.5 py-3 text-[14px] leading-6 shadow-sm transition-all duration-150 whitespace-pre-wrap break-words sm:px-4 ${
                    isUser
                      ? "max-w-[86%] rounded-tr-md border-indigo-400/25 bg-linear-to-br from-indigo-500 to-violet-600 text-white shadow-indigo-950/25 sm:max-w-[78%]"
                      : "max-w-[92%] rounded-tl-md border-white/[0.09] bg-[#171a22]/95 text-slate-200 shadow-black/20 hover:border-white/[0.13] sm:max-w-[88%]"
                  }`}
                >
                  {renderMessageContent(visibleContent)}
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
