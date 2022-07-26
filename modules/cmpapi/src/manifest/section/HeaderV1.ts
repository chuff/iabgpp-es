import { AbstractEncodableDataType } from "../datatype/AbstractEncodableDataType";
import { EncodableFibonacciIntegerRange } from "../datatype/EncodableFibonacciIntegerRange";
import { EncodableFixedInteger } from "../datatype/EncodableFixedInteger";
import { AbstractEncodableSection } from "./AbstractEncodableSection";

export class HeaderV1 extends AbstractEncodableSection {
  public static readonly ID = 3;
  public static readonly VERSION = 1;
  public static readonly NAME = "header";

  constructor(base64EncodedString?: string) {
    let fields = new Map<string, AbstractEncodableDataType<any>>();
    fields.set("id", new EncodableFixedInteger(6, HeaderV1.ID));
    fields.set("version", new EncodableFixedInteger(6, HeaderV1.VERSION));
    fields.set("sectionIds", new EncodableFibonacciIntegerRange([]));

    let segments = [["id", "version", "sectionIds"]];

    super(fields, segments);

    if (base64EncodedString && base64EncodedString.length > 0) {
      this.decode(base64EncodedString);
    }
  }
}
