export const isPriveteChat = (msg) => {
  const chatType = msg.chat.type;
  return chatType === "private" ? true : false;
};

export const isPriveteChatAndCommand = (msg) => {
  const isCommand = msg.text.includes("/");
  return isCommand;
};
