import { MessageSquare } from "lucide-react";
import { useSelector } from "react-redux";

function Nav() {
  
  const { selectedConversation } = useSelector((state) => state.conversation);
  
  const { messages } = useSelector((state) => state.message);
  return (
    <>
      {selectedConversation && (
        <div className="flex h-14 shrink-0 items-center gap-3 border-b border-white/[0.06] bg-[#0d0f14]/95 px-4 backdrop-blur sm:px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-400/10">
            <MessageSquare size={14} className="text-indigo-300" />
          </div>
          <div className="min-w-0 flex-1 truncate text-[14px] font-semibold tracking-tight text-slate-100">
            {selectedConversation?.title || "New Chat"}
          </div>
          <div className="shrink-0 rounded-full border border-white/[0.07] bg-white/[0.04] px-2.5 py-1 text-[10px] font-medium text-slate-500">
            {messages?.length} Messages
          </div>
        </div>
      )}
    </>
  );
}

export default Nav;
