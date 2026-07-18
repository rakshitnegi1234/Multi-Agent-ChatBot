import api from "../../Utils/axios";

export const updateConversation = async (payload) => {
  try {
    const { data } = await api.post("/api/v1/chat/update-conversation", payload);
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
};
