import { AbstractEncodableDataType } from "../datatype/AbstractEncodableDataType";
import { EncodableFixedInteger } from "../datatype/EncodableFixedInteger";
import { AbstractEncodableSection } from "./AbstractEncodableSection";

export class UspV1 extends AbstractEncodableSection {
  public static readonly ID = 7;
  public static readonly VERSION = 1;
  public static readonly NAME = "uspv1";

  constructor(base64EncodedString?: string) {
    let fields = new Map<string, AbstractEncodableDataType<any>>();
    fields.set("version", new EncodableFixedInteger(6, UspV1.VERSION));
    fields.set("notice", new EncodableFixedInteger(2));
    fields.set("optOutSale", new EncodableFixedInteger(2));
    fields.set("lspaCovered", new EncodableFixedInteger(2));

    let segments = [["version", "notice", "optOutSale", "lspaCovered"]];

    super(fields, segments);

    if (base64EncodedString && base64EncodedString.length > 0) {
      this.decode(base64EncodedString);
    }
  }
}
