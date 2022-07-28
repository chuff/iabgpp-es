import { GVL } from "../gvl/GVL.js";
import { EncodableSection } from "../manifest/section/EncodableSection.js";
import { Command } from "./Command.js";

/**
 * Gets a version of the Global Vendors List
 */
export class GetVendorListCommand extends Command {
  protected respond(): any {
    if (!this.param || this.param.length == 0) {
      throw new Error("<section>[.version] parameter required");
    }

    let parts = this.param.split(".");
    let sectionName = parts[0];
    let version = null;
    if (parts.length >= 2) {
      version = parseInt(parts[1]);
    }

    let section: EncodableSection = this.cmpApiContext.gppModel.getSection(sectionName);
    if (section) {
      let gvl = section.getGvl();
      if (gvl) {
        let gvlVersion = gvl.vendorListVersion;
        if (version && version !== gvl.vendorListVersion) {
          gvl = new GVL(version);
          section.setGvl(gvl);
        }
      } else {
        gvl = new GVL(version);
        section.setGvl(gvl);
      }

      if (gvl) {
        gvl.readyPromise.then((): void => {
          this.invokeCallback(gvl.getJson());
        });
      }
    }
    return null;
  }
}
