const { SimpleChatModel } = require("@langchain/core/language_models/chat_models");

class GenAIHubChatModel extends SimpleChatModel {

  constructor(params) {
    super(params);
  }

  _llmType() {
    return "GenAIHub";
  }

  async _call(messages, options, runManager) {
    // debugger;
    try {
      const chatMessages = [];
      messages.forEach(message => {
        switch (message.toDict().type) {
          case 'human':
            chatMessages.push({"role": "user","content": message.toDict().data.content});
            break;
          case 'system':
            chatMessages.push({"role": "system","content": message.toDict().data.content});
            break;
          case 'ai':
            chatMessages.push({"role": "assistant","content": message.toDict().data.content});
            break;
        }
      });
      const capLLMPlugin = await cds.connect.to("cap-llm-plugin");
      const chatResponse = await capLLMPlugin.getChatCompletion({messages: chatMessages});
      return chatResponse.content;
    } catch (error) {
      throw new Error("error while calling chat model apis via genai hub (cap-llm-plugin)");
    }
  }

  async *_streamResponseChunks(messages, options, runManager) {
    throw new Error("Streaming of response is not supported!")
  }

}


module.exports = {GenAIHubChatModel};