import { Command } from "./Command.js";
import { EncodableSection } from "../manifest/section/EncodableSection.js";

export class GetSectionCommand extends Command {
  protected respond(): any {
    if (!this.param || this.param.length == 0) {
      throw new Error("<section> parameter required");
    }

    let section: EncodableSection = this.cmpApiContext.gppModel.getSection(this.param);
    return section;
  }
}
