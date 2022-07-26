import { EncodingError } from "../error/EncodingError";
import { AbstractEncodableSection } from "./section/AbstractEncodableSection";
import { HeaderV1 } from "./section/HeaderV1";
import { TcfEuV2 } from "./section/TcfEuV2";
import { UspV1 } from "./section/UspV1";

export class GppModel {
  private sections = new Map<string, AbstractEncodableSection>();
  private sectionOrder: string[];

  constructor(base64EncodedString?: string) {
    this.sectionOrder = [TcfEuV2.NAME, UspV1.NAME];

    if (base64EncodedString && base64EncodedString.length > 0) {
      this.decode(base64EncodedString);
    }
  }

  public setSection(sectionName: string, section: AbstractEncodableSection) {
    this.sections.set(sectionName, section);
  }

  public hasSection(sectionName: string) {
    return this.sections.has(sectionName);
  }

  public getSection(sectionName: string) {
    return this.sections.get(sectionName);
  }

  public encode() {
    let unencodedSections = [];
    for (let i = 0; i < this.sectionOrder.length; i++) {
      let sectionName = this.sectionOrder[i];
      if (this.sections.has(sectionName)) {
        unencodedSections.push(this.sections.get(sectionName));
      }
    }

    let sectionIds = [];
    for (let i = 0; i < unencodedSections.length; i++) {
      sectionIds.push(unencodedSections[i].getId());
    }

    let header = new HeaderV1();
    header.setFieldValue("sectionids", sectionIds);
    unencodedSections.unshift(header);

    let encodedSections = [];
    for (let i = 0; i < unencodedSections.length; i++) {
      let section = unencodedSections[i];
      section.encode();
    }
    return encodedSections.join("~");
  }

  public decode(str: string) {
    this.sections.clear();

    let encodedSections = str.split("~");
    let header = new HeaderV1(encodedSections[0]);
    this.sections.set(HeaderV1.name, header);

    let sectionIds = header.getFieldValue("sectionIds");
    for (let i = 0; i < sectionIds; i++) {
      if (sectionIds[i] == TcfEuV2.ID) {
        let section = new TcfEuV2(encodedSections[i + 1]);
        this.sections.set(TcfEuV2.NAME, section);
      } else if (sectionIds[i] == UspV1.ID) {
        let section = new UspV1(encodedSections[i + 1]);
        this.sections.set(UspV1.NAME, section);
      }
    }
  }
}
