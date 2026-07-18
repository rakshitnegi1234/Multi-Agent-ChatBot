import { Menu, MessageSquare } from "lucide-react";
import { useSelector } from "react-redux";

function Nav({ onMenuClick }) {
  
  const { selectedConversation } = useSelector((state) => state.conversation);
  
  const { messages } = useSelector((state) => state.message);
  return (
    <div className="relative z-20 flex h-14 shrink-0 items-center gap-2.5 border-b border-white/[0.06] bg-[#0d0f14]/88 px-3 backdrop-blur-xl sm:px-5">
      <button
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.04] text-slate-400 transition-all duration-150 hover:border-cyan-300/20 hover:bg-cyan-300/[0.08] hover:text-cyan-100 active:scale-95 lg:hidden"
        onClick={onMenuClick}
        title="Open sidebar"
        type="button"
      >
        <Menu size={17} />
      </button>
      <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-400/10">
        <MessageSquare size={14} className="text-indigo-300" />
      </div>
      <div className="min-w-0 flex-1 truncate text-[14px] font-semibold tracking-tight text-slate-100">
        {selectedConversation?.title || "AgentForge"}
      </div>
      <div className="shrink-0 rounded-full border border-white/[0.07] bg-white/[0.04] px-2.5 py-1 text-[10px] font-medium text-slate-500">
        {selectedConversation ? `${messages?.length} Messages` : "Ready"}
      </div>
    </div>
  );
}

export default Nav;
