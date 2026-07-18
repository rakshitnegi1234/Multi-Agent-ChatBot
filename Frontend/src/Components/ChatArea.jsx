import Nav from "./Nav";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import getMessages from "../Features/getMessages";
import { setMessages } from "../Redux/messageSlice";

function ChatArea({ onMenuClick }) {
  const { selectedConversation } = useSelector((state) => state.conversation);
  const [draftPrompt, setDraftPrompt] = useState("");
  const [respondingConversationId, setRespondingConversationId] =
    useState(null);
  const dispatch = useDispatch();
  const isResponding = Boolean(respondingConversationId);

  useEffect(() => {
    const getMesg = async () => {
      if (selectedConversation) {
        const data = await getMessages(selectedConversation?._id);

        dispatch(setMessages(data));
      }
    };

    getMesg();
  }, [dispatch, selectedConversation]);

  return (
    <>
      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-[#0d0f14] before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(180deg,rgba(34,211,238,0.04),transparent_30%),linear-gradient(140deg,rgba(99,102,241,0.08),transparent_38%),linear-gradient(320deg,rgba(20,184,166,0.05),transparent_42%)] after:pointer-events-none after:absolute after:inset-0 after:bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] after:bg-size-[44px_44px] after:opacity-30">
        <Nav onMenuClick={onMenuClick} />
        <MessageList
          isResponding={respondingConversationId === selectedConversation?._id}
          onSuggestionSelect={setDraftPrompt}
        />
        <ChatInput
          value={draftPrompt}
          setValue={setDraftPrompt}
          isResponding={isResponding}
          setRespondingConversationId={setRespondingConversationId}
        />
      </div>
    </>
  );
}

export default ChatArea;
