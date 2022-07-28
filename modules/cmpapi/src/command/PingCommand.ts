import { Command } from "./Command.js";

export class PingCommand extends Command {
  protected respond() {
    let response = {
      gppVersion: this.cmpApiContext.gppVersion,
      cmpStatus: this.cmpApiContext.cmpStatus,
      cmpDisplayStatus: this.cmpApiContext.cmpDisplayStatus,
      apiSupport: this.cmpApiContext.apiSupport,
      currentAPI: this.cmpApiContext.currentAPI,
      cmpId: this.cmpApiContext.cmpId,
      cmpVersion: this.cmpApiContext.cmpVersion,
    };

    this.invokeCallback(response);
    return response;
  }
}
