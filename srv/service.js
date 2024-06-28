const cds = require("@sap/cds");
const utilSummary = require("./util/utilSummary");
const filePath = "/Users/I350548/Downloads/AiLearning/cap-summarization-chain/srv/util/state_of_the_union.txt";


class service extends cds.ApplicationService {
  async init() {

    this.on("getSummaryByStuff", async (req)=> {
      const textDocuments = await utilSummary.getTextDocuments(filePath);
      return await utilSummary.summarize(textDocuments, "stuff")
    })

    this.on("getSummaryByRefine", async (req)=> {
      const textDocuments = await utilSummary.getTextDocuments(filePath);
      return await utilSummary.summarize(textDocuments, "refine")
    })

    this.on("getSummaryByReduce", async (req)=> {
      const textDocuments = await utilSummary.getTextDocuments(filePath);
      return await utilSummary.summarize(textDocuments, "map_reduce")
    })

    await super.init();
  }
}
module.exports = service;

