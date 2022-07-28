import { CmpApiContext } from "./CmpApiContext.js";
import { CustomCommands } from "./CustomCommands.js";
import { CmpStatus } from "./status/CmpStatus.js";
import { DisplayStatus } from "./status/DisplayStatus.js";
import { EventStatus } from "./status/EventStatus.js";
import { CallResponder } from "./CallResponder.js";
import { GppModel } from "./manifest/GppModel.js";

export class CmpApi {
  private callResponder: CallResponder;
  private numUpdates = 0;
  public cmpApiContext: CmpApiContext;
  public foo = "foo";

  /**
   * @param {number} cmpId - IAB assigned CMP ID
   * @param {number} cmpVersion - integer version of the CMP
   * @param {CustomCommands} [customCommands] - custom commands from the cmp
   */
  public constructor(cmpId: number, cmpVersion: number, customCommands?: CustomCommands) {
    this.throwIfInvalidInt(cmpId, "cmpId", 2);
    this.throwIfInvalidInt(cmpVersion, "cmpVersion", 0);

    this.cmpApiContext = new CmpApiContext();
    this.cmpApiContext.cmpId = cmpId;
    this.cmpApiContext.cmpVersion = cmpVersion;

    this.callResponder = new CallResponder(this.cmpApiContext, customCommands);
  }

  private throwIfInvalidInt(value: number, name: string, minValue: number): void | never {
    if (!(typeof value === "number" && Number.isInteger(value) && value >= minValue)) {
      throw new Error(`Invalid ${name}: ${value}`);
    }
  }

  public fireUpdate(uiVisible = false): void {
    if (this.cmpApiContext.disabled) {
      throw new Error("CmpApi Disabled");
    }

    this.cmpApiContext.cmpStatus = CmpStatus.LOADED;

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

    this.cmpApiContext.eventQueue.exec();

    this.numUpdates++;
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

  /**
   * Disables the CmpApi from serving anything but ping and custom commands
   * Cannot be undone
   *
   * @return {void}
   */
  public disable(): void {
    this.cmpApiContext.disabled = true;
    this.cmpApiContext.cmpStatus = CmpStatus.ERROR;
  }
}
