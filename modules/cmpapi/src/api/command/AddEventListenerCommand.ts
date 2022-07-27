import { CmpApiModel } from "../CmpApiModel.js";
import { Command } from "./Command.js";

export class AddEventListenerCommand extends Command {
  protected respond(): void {
    this.invokeCallback(
      CmpApiModel.eventQueue.add({
        callback: this.callback,
        param: this.param,
        next: this.next,
      })
    );
  }
}
