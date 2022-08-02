import { Command } from "./Command.js";

export class GetGppStringCommand extends Command {
  protected respond(): any {
    let gppString = this.cmpApiContext.gppModel.encode();
    this.invokeCallback(gppString);
    return gppString;
  }
}
