const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
const { loadSummarizationChain, SummarizationChainParams } = require("langchain/chains");
const { PromptTemplate } = require("@langchain/core/prompts");
const fs = require("fs");
const utilGenAIHub = require("./utilGenAIHub");

const stuffConfig   = { type:"stuff", 
                        prompt:new PromptTemplate({inputVariables: ["text"], template: 'Write a short and concise summary of the following:\n\n\n"{text}"\n\n\nCONCISE SUMMARY:'}) };
const refineConfig  = { type:"refine", 
                        refinePrompt:new PromptTemplate({inputVariables: ["existing_answer","text"], template: 'Your job is to produce a final summary\nWe have provided an existing summary up to a certain point: \"{existing_answer}\"\nWe have the opportunity to refine the existing summary\n(only if needed) with some more context below.\n------------\n\"{text}\"\n------------\n\nGiven the new context, refine the original summary\nIf the context isnt useful, return the original summary.\n\nREFINED SUMMARY:'}),
                        questionPrompt:new PromptTemplate({inputVariables: ["text"], template: 'Write a short and concise summary of the following:\n\n\n"{text}"\n\n\nCONCISE SUMMARY:'}) };
const reduceConfig  = { type:"map_reduce", 
                        combinePrompt:new PromptTemplate({inputVariables: ["text"], template: 'Write a short and concise summary of the following:\n\n\n"{text}"\n\n\nCONCISE SUMMARY:'}),
                        combineMapPrompt:new PromptTemplate({inputVariables: ["text"], template: 'Write a short and concise summary of the following:\n\n\n"{text}"\n\n\nCONCISE SUMMARY:'}) };

const summarize = async function(textDocuments, type) {
  let configParams;
  switch (type) {
    case "stuff":
      configParams = stuffConfig;
      break;
    case "refine":
      configParams = refineConfig;
      break;
    case "map_reduce":
      configParams = reduceConfig;
      break;
  }
  
  const chatModel     = new utilGenAIHub.GenAIHubChatModel({});
  const summaryChain  = loadSummarizationChain(chatModel, summaryConfig);
  const textSummary   = await summaryChain.invoke({ input_documents: configParams });
  return textSummary;
}

const getTextDocuments = async function(filePath) {
  const textContent   = fs.readFileSync(filePath, "utf8");
  const textSplitter  = new RecursiveCharacterTextSplitter({ chunkSize: 3000 });
  const textDocuments = await textSplitter.createDocuments([textContent]);
  return textDocuments;
}

module.exports = { summarize, getTextDocuments}

