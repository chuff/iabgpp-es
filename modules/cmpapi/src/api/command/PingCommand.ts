import { CmpApiModel } from "../CmpApiModel";
import { Command } from "./Command";

export class PingCommand extends Command {
  protected respond(): void {
    this.invokeCallback({
      gppVersion: CmpApiModel.gppVersion,
      cmpStatus: CmpApiModel.cmpStatus,
      cmpDisplayStatus: CmpApiModel.cmpDisplayStatus,
      apiSupport: CmpApiModel.apiSupport,
      currentAPI: CmpApiModel.currentAPI,
      cmpId: CmpApiModel.cmpId,
      cmpVersion: CmpApiModel.cmpVersion,
    });
  }
}
