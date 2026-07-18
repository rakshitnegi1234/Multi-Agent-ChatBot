import Nav from "./Nav";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import getMessages from "../Features/getMessages";
import { setMessages } from "../Redux/messageSlice";

function ChatArea() {
  const { selectedConversation } = useSelector((state) => state.conversation);
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
      <div className="flex min-w-0 flex-1 flex-col bg-[#0d0f14]">
        <Nav />
        <MessageList
          isResponding={respondingConversationId === selectedConversation?._id}
        />
        <ChatInput
          isResponding={isResponding}
          setRespondingConversationId={setRespondingConversationId}
        />
      </div>
    </>
  );
}

export default ChatArea;
