import {
  MessageSquare,
  PanelLeftIcon,
  PenSquare,
  Plus,
  User,
  Coins,
  LogOut,
  PanelRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getConversations } from "../Features/getConversations";
import { useDispatch, useSelector } from "react-redux";
import {
  setconversations,
  setSelectedConversation,
} from "../Redux/conversation.Slice";
import { setUserdata } from "../Redux/userSlice.js";
import { logOut } from "../Features/logOut.js";
import { setMessages } from "../Redux/messageSlice.js";

function SideBar() {
  const [collapsed, setCollapsed] = useState(false);
  const [imageerror, setImageError] = useState(false);
  const dispatch = useDispatch();
  const { conversations, selectedConversation } = useSelector(
    (state) => state.conversation,
  );
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const getConversation = async () => {
      if (!userData?._id) {
        dispatch(setconversations([]));
        dispatch(setSelectedConversation(null));
        dispatch(setMessages([]));
        return;
      }

      const data = await getConversations();
      dispatch(setconversations(data));
    };

    getConversation();
  }, [dispatch, userData?._id]);

  const handleCreateConversation = () => {
    if (!userData?._id) return;

    dispatch(setSelectedConversation(null));
    dispatch(setMessages([]));
  };

  const handleLogout = async () => {
    await logOut();
    dispatch(setUserdata(null));
    dispatch(setconversations([]));
    dispatch(setSelectedConversation(null));
    dispatch(setMessages([]));
  };

  if (collapsed) {
    return (
      <div className="hidden h-screen w-[56px] shrink-0 flex-col items-center gap-1 border-r border-white/[0.06] bg-[#0b0d12] py-4 lg:flex">
        <button
          className="mb-1 flex h-9 w-9 items-center justify-center rounded-xl border-none bg-transparent text-slate-500 transition-colors duration-150 hover:bg-white/[0.06] hover:text-slate-200"
          onClick={() => setCollapsed(false)}
        >
          <PanelRight />
        </button>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03] text-slate-500 transition-all duration-150 hover:border-cyan-400/20 hover:bg-white/[0.07] hover:text-slate-200"
          onClick={handleCreateConversation}
        >
          <Plus size={17} />
        </button>
        <div className="flex-1 overflow-y-auto px-2.5 pb-2 [scroll-width:none] [&::-webkit-scrollbar]:hidden pt-10">
          {conversations.map((conv) => {
            const isActive = selectedConversation?._id === conv?._id;

            return (
              <div
                key={conv._id}
                onClick={() => dispatch(setSelectedConversation(conv))}
                className={`mb-1 flex cursor-pointer items-center gap-2.5 rounded-xl border px-2.5 py-2.5 transition-all duration-150 ${
                  isActive
                    ? "border-indigo-400/20 bg-indigo-500/10"
                    : "border-transparent bg-transparent hover:bg-white/[0.04]"
                }`}
              >
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors duration-150 ${
                    isActive
                      ? "bg-indigo-500/15 text-indigo-300"
                      : "bg-white/[0.05] text-slate-400"
                  }`}
                >
                  <MessageSquare size={13} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative shrink-0">
          {userData?.avatar || !imageerror ? (
            <img
              className="w-9 h-9 rounded-[10px] object-cover border-2 border-indigo-500/25"
              src={userData?.avatar}
              alt={"image"}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-9 h-9 rounded-[10px] bg-white/[0.06] flex items-center justify-center">
              <User size={15} className="text-slate-400" />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-y-0 left-0 z-50 h-screen w-[270px] shrink-0 border-r border-white/[0.06] bg-[#0b0d12] lg:static">
        <div className="flex flex-col h-full">
          {/* HEADER */}

          <div className="flex h-16 items-center gap-2.5 border-b border-white/[0.06] px-4">
            <div
              className="hidden h-8 w-8 items-center justify-center rounded-xl border-none bg-transparent text-slate-500 transition-colors duration-150 hover:bg-white/[0.06] hover:text-slate-200 lg:flex"
              onClick={() => {
                setCollapsed(true);
              }}
            >
              <PanelLeftIcon />
            </div>
            <span className="flex-1 text-[16px] font-semibold tracking-tight text-slate-100">
              AgentForge
            </span>
            <span className="rounded-full border border-indigo-400/20 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium tracking-wide text-indigo-300">
              free
            </span>
            <button
              className="flex h-8 w-8 items-center justify-center rounded-xl border-none bg-transparent text-slate-500 transition-colors duration-150 hover:bg-white/[0.06] hover:text-slate-200"
              onClick={handleCreateConversation}
            >
              <PenSquare size={14} />
            </button>
          </div>

          {/* NEW CHAT */}

          <div className="px-4 pb-2 pt-4">
            <button
              className="flex w-full items-center justify-center gap-2 rounded-xl border-none bg-linear-to-br from-cyan-500 to-indigo-600 py-[11px] text-sm font-medium text-white shadow-[0_0_24px_rgba(34,211,238,0.12)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(99,102,241,0.18)]"
              onClick={handleCreateConversation}
            >
              <Plus size={15} />
              New Chat
            </button>
          </div>

          {/* CONVERSATION */}

          {conversations.length === 0 ? (
            <div className="px-5 pb-1.5 pt-4 text-[10.5px] font-semibold uppercase tracking-widest text-slate-600">
              No Recent Conversations
            </div>
          ) : (
            <div className="px-5 pb-1.5 pt-4 text-[10.5px] font-semibold uppercase tracking-widest text-slate-600">
              Recents
            </div>
          )}

          {/* CONVERSATION MAPPING */}

          <div className="flex-1 overflow-y-auto px-2.5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {conversations.map((conv) => {
              const isActive = selectedConversation?._id === conv?._id;

              return (
                <div
                  key={conv._id}
                  onClick={() => dispatch(setSelectedConversation(conv))}
                  className={`mb-1 flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 transition-all duration-150 ${
                    isActive
                      ? "border-indigo-400/20 bg-indigo-500/10"
                      : "border-transparent bg-transparent hover:bg-white/[0.045]"
                  }`}
                >
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors duration-150 ${
                      isActive
                        ? "bg-indigo-500/15 text-indigo-300"
                        : "bg-white/[0.05] text-slate-400"
                    }`}
                  >
                    <MessageSquare size={13} />
                  </div>

                  <span
                    className={`min-w-0 flex-1 truncate text-[13px] font-medium ${
                      isActive ? "text-slate-100" : "text-slate-300"
                    }`}
                  >
                    {conv?.title || "New Chat"}
                  </span>
                </div>
              );
            })}
          </div>

          {/* FOOTER */}
          <div className="mx-3 h-px bg-white/[0.06]" />

          <div className="px-3 py-3">
            {userData && (
              <div className="flex items-center gap-2.5 rounded-2xl border border-white/[0.06] bg-white/[0.025] px-3 py-2.5 transition-colors duration-150 hover:bg-white/[0.05]">
                <div className="relative shrink-0">
                  {userData?.avatar || !imageerror ? (
                    <img
                      className="h-9 w-9 rounded-xl border-2 border-indigo-500/25 object-cover"
                      src={userData?.avatar}
                      alt={"image"}
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06]">
                      <User size={15} className="text-slate-400" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="truncate text-[13.5px] font-semibold text-slate-100">
                    {userData?.name || "user"}
                  </p>
                  <p className="mt-px text-[11px] text-slate-600">
                    {"Free Plan"}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button className="flex h-7 w-7 items-center justify-center rounded-lg border-none bg-transparent text-yellow-600 transition-all duration-150 hover:bg-white/[0.08] hover:text-yellow-400">
                    <Coins size={16} />
                  </button>
                  <button
                    className="flex h-7 w-7 items-center justify-center rounded-lg border-none bg-transparent text-slate-600 transition-all duration-150 hover:bg-white/[0.08] hover:text-slate-300"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default SideBar;
