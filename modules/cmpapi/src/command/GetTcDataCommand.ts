import { EncodableSection } from "../manifest/section/EncodableSection.js";
import { Command } from "./Command.js";

export class GetTcDataCommand extends Command {
  protected respond(): any {
    let response = null;
    let section: EncodableSection = this.cmpApiContext.gppModel.getSection("tcfeuv2");
    if (section) {
      response = section.toObject();
    }
    this.invokeCallback(response);
    return null;
  }
}
