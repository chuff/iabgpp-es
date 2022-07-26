import { CmpApiModel } from "../CmpApiModel";
import { Command } from "./Command";

export class HasSectionCommand extends Command {
  protected respond(): void {
    this.invokeCallback(CmpApiModel.gppModel.hasSection(this.param));
  }
}
