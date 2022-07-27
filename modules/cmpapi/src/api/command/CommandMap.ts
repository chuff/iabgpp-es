import { PingCommand } from "./PingCommand";
import { GetFieldCommand } from "./GetFieldCommand";
import { GetGppStringCommand } from "./GetGppStringCommand";
import { GetSectionCommand } from "./GetSectionCommand";
import { HasSectionCommand } from "./HasSectionCommand";
import { GppCommand } from "./GppCommand";
import { GetVendorListCommand } from "./GetVendorListCommand";
import { AddEventListenerCommand } from "./AddEventListenerCommand";
import { RemoveEventListenerCommand } from "./RemoveEventListenerCommand";
import { GetGppDataCommand } from "./GetGppDataCommand";

export class CommandMap {
  public static [GppCommand.ADD_EVENT_LISTENER]: typeof AddEventListenerCommand = AddEventListenerCommand;
  public static [GppCommand.GET_FIELD]: typeof GetFieldCommand = GetFieldCommand;
  public static [GppCommand.GET_GPP_DATA]: typeof GetGppDataCommand = GetGppDataCommand;
  public static [GppCommand.GET_GPP_STRING]: typeof GetGppStringCommand = GetGppStringCommand;
  public static [GppCommand.GET_SECTION]: typeof GetSectionCommand = GetSectionCommand;
  public static [GppCommand.GET_VENDOR_LIST]: typeof GetVendorListCommand = GetVendorListCommand;
  public static [GppCommand.HAS_SECTION]: typeof HasSectionCommand = HasSectionCommand;
  public static [GppCommand.PING]: typeof PingCommand = PingCommand;
  public static [GppCommand.REMOVE_EVENT_LISTENER]: typeof RemoveEventListenerCommand = RemoveEventListenerCommand;
}
