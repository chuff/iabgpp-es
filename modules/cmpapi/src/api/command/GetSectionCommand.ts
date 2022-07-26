import { AbstractEncodableSection } from "../../manifest/section/AbstractEncodableSection";
import { CmpApiModel } from "../CmpApiModel";
import { Command } from "./Command";

export class GetSectionCommand extends Command {
  protected respond(): void {
    let section: AbstractEncodableSection = CmpApiModel.gppModel.getSection(this.param);
    if (section) {
      this.invokeCallback(section.toObject());
    } else {
      throw new Error("Section '" + this.param + "' not found");
    }
  }
}
