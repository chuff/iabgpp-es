import { PingCommand } from "./PingCommand";
import { GetFieldCommand } from "./GetFieldCommand";
import { GetGppStringCommand } from "./GetGppStringCommand";
import { GetSectionCommand } from "./GetSectionCommand";
import { HasSectionCommand } from "./HasSectionCommand";
import { GppCommand } from "./GppCommand";

export class CommandMap {
  public static [GppCommand.GET_FIELD]: typeof GetFieldCommand = GetFieldCommand;
  public static [GppCommand.GET_GPP_STRING]: typeof GetGppStringCommand = GetGppStringCommand;
  public static [GppCommand.GET_SECTION]: typeof GetSectionCommand = GetSectionCommand;
  public static [GppCommand.HAS_SECTION]: typeof HasSectionCommand = HasSectionCommand;
  public static [GppCommand.PING]: typeof PingCommand = PingCommand;
}
