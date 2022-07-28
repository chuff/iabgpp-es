import { Command } from "./Command.js";

export class GetGppStringCommand extends Command {
  protected respond(): any {
    let response = this.cmpApiContext.gppModel.encode();
    return response;
  }
}
