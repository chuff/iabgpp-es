import { CmpApiModel } from "../CmpApiModel";
import { Command } from "./Command";

export class GetGppStringCommand extends Command {
  protected respond(): void {
    this.invokeCallback(CmpApiModel.gppModel.encode());
  }
}
