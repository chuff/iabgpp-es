import { Command } from "./Command.js";

export class HasSectionCommand extends Command {
  protected respond(): any {
    if (!this.param || this.param.length === 0) {
      throw new Error("<section>[.version] parameter required");
    }

    let response = this.cmpApiContext.gppModel.hasSection(this.param);
    return response;
  }
}
