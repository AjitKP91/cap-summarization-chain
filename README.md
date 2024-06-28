> for any queries contact **Ajit Kumar Panda (ajit.kumar.panda@sap.com)**

### Langchain Summarization Chain with SAP GenAIHub

#### Introduction
This sample repository contains sourcecode for summarization of texts using [Langchain](https://js.langchain.com/v0.2/docs/introduction/) summarization chain. 

>Langchain's summarization chain supports 3 techniques i.e. Stuff, Refine, Map-Reduce. 
>1.  Stuff: The chain will take a list of documents, insert them all into a prompt, and pass that prompt to an LLM for summarization.
>2.  Map-Reduce: The chain will first summarize each document using LLM, then combine the summaries into a prompt , and pass that prompt to an LLM for final summarization.
>3.  Refine: The chain updates a rolling summary by iterating over the documents in a sequence.  In each iteration, the current document and the previously generated summary are passed as prompt for summarization.

Note: Here, document refers to langchain module: [Document](https://v02.api.js.langchain.com/classes/langchain_core_documents.Document.html).    
In Js, it is an object with 2 properties: paegContent, metadata
Example: 
```json 
  { 
    "pageContent":"The Marvel Cinematic Universe (MCU) is a media franchise and shared universe centered around a series of superhero films and television series produced by Marvel Studios. It features interconnected stories based on characters from Marvel Comics, including iconic heroes like Iron Man, Captain America, and Spider-Man. The MCU has become one of the highest-grossing film franchises, renowned for its expansive world-building and cross-character plotlines",   
    "metadata":{"lines":{"from":1, "to":3}}
  }
```

More details can be found here: 
- [[Python] Summarize Text](https://python.langchain.com/v0.2/docs/tutorials/summarization/) 
- [[Js] Summarization](https://js.langchain.com/v0.1/docs/modules/chains/popular/summarize/)

#### Some Details:
- Text content which needs to be summarized is read from a file: [state_of_the_union.txt](./srv/util/state_of_the_union.txt)
- Different text splitters can be used to convert large content into chuks (documents). In this sample RecursiveCharacterTextSplitter is used. [More Info](https://js.langchain.com/v0.1/docs/modules/data_connection/document_transformers/)
- CAP service has 3 methods for 3 different techniques:
  - `getSummaryByStuff`: Summarization by Stuff technique
  - `getSummaryByReduce`: Summarization by MapReduce technique
  - `getSummaryByRefine`: Summarization by Refine technique
- Custom chat model is created as a util ([here:utilGenAIHub.js](./srv/util/utilGenAIHub.js)) where [cap-llm-plugin](https://community.sap.com/t5/technology-blogs-by-sap/cap-llm-plugin-empowering-developers-for-rapid-gen-ai-cap-app-development/ba-p/13667606) is used to make LLM call via SAP GenAI Hub. ([How to Create Custom Chat Model](https://js.langchain.com/v0.2/docs/how_to/custom_chat/))
- Summary logic is added in a util as well where prompts can be changed according to your choice ([here: utilSummary.js](./srv/util/utilSummary.js))


#### Run locally
- Clone repo and install all packages: `npm i`
- update [.cdsrc.json](./.cdsrc.json) with your deployment id, resource group, destination etc.
  ```json
  {
    "requires": {
      "db": "hana",
      "cap-llm-plugin": {
        "impl": "cap-llm-plugin/srv/cap-llm-plugin.js"
      },
      "GENERATIVE_AI_HUB": {
        "CHAT_MODEL_DESTINATION_NAME": "AICoreAzureOpenAIDestination",
        "CHAT_MODEL_DEPLOYMENT_URL": "/v2/inference/deployments/<deployment id>",
        "CHAT_MODEL_RESOURCE_GROUP": "<resource group>",
        "CHAT_MODEL_API_VERSION": "2023-05-15"
      },
      "AICoreAzureOpenAIDestination": {
        "kind": "rest",
        "credentials": {
          "destination": "<destination name>",
          "requestTimeout": "300000"
        }
      }
    }
  }
  ```
  Note: destination will point to AI core api with its credentials.
- Login into cloud foundry and run following commands:
  - `cf cs destination lite cap-summarization-chain-dest`
  - `cds bind --to cap-summarization-chain-dest --for development`
  - `cf cs xsuaa application cap-summarization-chain-auth`
  - `cds bind --to cap-summarization-chain-auth --for development`
- Run application: `cds watch`
- Use [test.http](test.http) to trigger calls