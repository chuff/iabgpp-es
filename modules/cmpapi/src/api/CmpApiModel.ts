import { CmpStatus } from "./status/CmpStatus";
import { DisplayStatus } from "./status/DisplayStatus";
import { EventStatus } from "./status/EventStatus";
import { EventListenerQueue } from "./EventListenerQueue";
import { GppModel } from "../manifest/GppModel";
import { TcfEuV2 } from "../manifest/section/TcfEuV2";
import { UspV1 } from "../manifest/section/UspV1";

/**
 * Class holds shareable data across cmp api and provides change event listener for GppModel.
 * Within the context of the CmpApi, this class acts much like a global state or database,
 * where CmpApi sets data and Commands read the data.
 */
export class CmpApiModel {
  public static gppVersion = "1.0";
  public static apiSupport = [TcfEuV2.NAME, UspV1.NAME];

  public static readonly eventQueue = new EventListenerQueue();
  public static cmpStatus: CmpStatus = CmpStatus.LOADING;
  public static disabled = false;
  public static cmpDisplayStatus: DisplayStatus = DisplayStatus.HIDDEN;

  public static cmpId: number;
  public static cmpVersion: number;
  public static currentAPI: string;
  public static eventStatus: EventStatus;
  public static gppModel: GppModel;
  public static gppString: string;

  public static reset(): void {
    delete this.cmpId;
    delete this.cmpVersion;
    delete this.currentAPI;
    delete this.eventStatus;
    delete this.gppModel;
    delete this.gppString;

    this.cmpStatus = CmpStatus.LOADING;
    this.disabled = false;
    this.cmpDisplayStatus = DisplayStatus.HIDDEN;
    this.eventQueue.clear();
  }
}
