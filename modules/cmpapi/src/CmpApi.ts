import { CmpApiContext } from "./CmpApiContext.js";
import { CustomCommands } from "./CustomCommands.js";
import { CmpStatus } from "./status/CmpStatus.js";
import { DisplayStatus } from "./status/DisplayStatus.js";
import { EventStatus } from "./status/EventStatus.js";
import { CallResponder } from "./CallResponder.js";
import { TcfEuV2 } from "./manifest/section/TcfEuV2.js";
import { UspV1 } from "./manifest/section/UspV1.js";

export class CmpApi {
  private callResponder: CallResponder;
  private cmpApiContext: CmpApiContext;

  /**
   * @param {number} cmpId - IAB assigned CMP ID
   * @param {number} cmpVersion - integer version of the CMP
   * @param {CustomCommands} [customCommands] - custom commands from the cmp
   */
  public constructor(cmpId: number, cmpVersion: number, customCommands?: CustomCommands) {
    this.cmpApiContext = new CmpApiContext();
    this.cmpApiContext.cmpId = cmpId;
    this.cmpApiContext.cmpVersion = cmpVersion;

    this.callResponder = new CallResponder(this.cmpApiContext, customCommands);
  }

  public fireUpdate(currentAPI?: string, uiVisible = false): void {
    this.cmpApiContext.cmpStatus = CmpStatus.LOADED;
    this.cmpApiContext.currentAPI;

    if (uiVisible) {
      this.cmpApiContext.cmpDisplayStatus = DisplayStatus.VISIBLE;
      this.cmpApiContext.eventStatus = EventStatus.CMP_UI_SHOWN;
    } else {
      if (this.cmpApiContext.gppModel === undefined) {
        this.cmpApiContext.cmpDisplayStatus = DisplayStatus.DISABLED;
        this.cmpApiContext.eventStatus = EventStatus.GPP_LOADED;
      } else {
        this.cmpApiContext.cmpDisplayStatus = DisplayStatus.HIDDEN;
        this.cmpApiContext.eventStatus = EventStatus.USER_ACTION_COMPLETE;
      }
    }

    if (currentAPI && currentAPI.length > 0) {
      this.cmpApiContext.eventQueue.exec(currentAPI);
    } else {
      this.cmpApiContext.eventQueue.exec(TcfEuV2.NAME);
      this.cmpApiContext.eventQueue.exec(UspV1.NAME);
    }
  }

  public getCurrentAPI() {
    return this.cmpApiContext.currentAPI;
  }

  public setGppString(encodedGppString: string): void {
    this.cmpApiContext.gppModel.decode(encodedGppString);
  }

  public getGppString() {
    return this.cmpApiContext.gppModel.encode();
  }

  public setSectionString(sectionName: string, encodedSectionString: string): void {
    this.cmpApiContext.gppModel.decodeSection(sectionName, encodedSectionString);
  }

  public getSectionString(sectionName: string): string {
    return this.cmpApiContext.gppModel.encodeSection(sectionName);
  }

  public setFieldValue(sectionName: string, fieldName: string, value: any) {
    this.cmpApiContext.gppModel.setFieldValue(sectionName, fieldName, value);
  }

  public getFieldValue(sectionName: string, fieldName: string) {
    return this.cmpApiContext.gppModel.getFieldValue(sectionName, fieldName);
  }

  public getSection(sectionName: string) {
    return this.cmpApiContext.gppModel.getSection(sectionName);
  }
}
