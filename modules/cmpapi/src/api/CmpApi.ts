import { CmpApiModel } from "./CmpApiModel";
import { CustomCommands } from "./CustomCommands";
import { CmpStatus } from "./status/CmpStatus";
import { DisplayStatus } from "./status/DisplayStatus";
import { EventStatus } from "./status/EventStatus";
import { CallResponder } from "./CallResponder";
import { GppModel } from "../manifest/GppModel";

export class CmpApi {
  private callResponder: CallResponder;
  private isServiceSpecific: boolean;
  private numUpdates = 0;

  /**
   * @param {number} cmpId - IAB assigned CMP ID
   * @param {number} cmpVersion - integer version of the CMP
   * @param {boolean} isServiceSpecific - whether or not this cmp is configured to be service specific
   * @param {CustomCommands} [customCommands] - custom commands from the cmp
   */
  public constructor(cmpId: number, cmpVersion: number, isServiceSpecific = false, customCommands?: CustomCommands) {
    this.throwIfInvalidInt(cmpId, "cmpId", 2);
    this.throwIfInvalidInt(cmpVersion, "cmpVersion", 0);

    CmpApiModel.cmpId = cmpId;
    CmpApiModel.cmpVersion = cmpVersion;

    this.isServiceSpecific = !!isServiceSpecific;
    this.callResponder = new CallResponder(customCommands);
  }

  private throwIfInvalidInt(value: number, name: string, minValue: number): void | never {
    if (!(typeof value === "number" && Number.isInteger(value) && value >= minValue)) {
      throw new Error(`Invalid ${name}: ${value}`);
    }
  }

  /**
   * update - When the state of a CMP changes this function should be called
   * with the updated tc string and whether or not the UI is visible or not
   *
   * @param {string|null} encodedTCString - set a string to signal that
   * gdprApplies and that an encoded tc string is being passed.  If GDPR does
   * not apply, set to null.
   * @param {boolean} uiVisible - default false.  set to true if the ui is
   * being shown with this tc string update, this will set the correct values
   * for eventStatus and displayStatus.
   * @return {void}
   */
  public update(base64EncodedGppString: string | null, uiVisible = false): void {
    if (CmpApiModel.disabled) {
      throw new Error("CmpApi Disabled");
    }

    CmpApiModel.cmpStatus = CmpStatus.LOADED;

    if (uiVisible) {
      CmpApiModel.cmpDisplayStatus = DisplayStatus.VISIBLE;
      CmpApiModel.eventStatus = EventStatus.CMP_UI_SHOWN;
    } else {
      if (CmpApiModel.gppModel === undefined) {
        CmpApiModel.cmpDisplayStatus = DisplayStatus.DISABLED;
        CmpApiModel.eventStatus = EventStatus.GPP_LOADED;
      } else {
        CmpApiModel.cmpDisplayStatus = DisplayStatus.HIDDEN;
        CmpApiModel.eventStatus = EventStatus.USER_ACTION_COMPLETE;
      }
    }

    if (base64EncodedGppString === "") {
      CmpApiModel.gppModel = new GppModel();
    } else {
      CmpApiModel.gppModel = new GppModel(base64EncodedGppString);
    }

    CmpApiModel.gppString = base64EncodedGppString;

    if (this.numUpdates === 0) {
      /**
       * Will make AddEventListener Commands respond immediately.
       */

      this.callResponder.purgeQueuedCalls();
    } else {
      /**
       * Should be no queued calls and only any addEventListener commands
       */

      CmpApiModel.eventQueue.exec();
    }

    this.numUpdates++;
  }

  /**
   * Disables the CmpApi from serving anything but ping and custom commands
   * Cannot be undone
   *
   * @return {void}
   */
  public disable(): void {
    CmpApiModel.disabled = true;
    CmpApiModel.cmpStatus = CmpStatus.ERROR;
  }
}
