import { CmpApiModel } from "../CmpApiModel.js";
import { Command } from "./Command.js";

export class GetGppDataCommand extends Command {
  protected respond(): void {
    this.invokeCallback(CmpApiModel.gppModel.toObject());
  }
}
