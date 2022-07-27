import { AbstractEncodableSection } from "../../manifest/section/AbstractEncodableBitStringSection";
import { CmpApiModel } from "../CmpApiModel";
import { Command } from "./Command";

export class GetFieldCommand extends Command {
  protected respond(): void {
    let parts = this.param.split(".");
    if (parts.length != 2) {
      throw new Error("Field name must be in the format <section>.<fieldName>");
    }
    let sectionName = parts[0];
    let fieldName = parts[1];

    let section: AbstractEncodableSection = CmpApiModel.gppModel.getSection(sectionName);
    if (section) {
      if (section.hasField(fieldName)) {
        this.invokeCallback(section.getFieldValue(fieldName));
      } else {
        throw new Error("Field value '" + fieldName + "' not found");
      }
    } else {
      throw new Error("Section '" + this.param + "' not found");
    }
  }
}
