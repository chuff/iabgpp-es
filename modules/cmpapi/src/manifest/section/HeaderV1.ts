import { Base64UrlEncoder } from "../../encoder/Base64UrlEncoder";
import { AbstractEncodableBitStringDataType } from "../datatype/AbstractEncodableBitStringDataType";
import { EncodableFibonacciIntegerRange } from "../datatype/EncodableFibonacciIntegerRange";
import { EncodableFixedInteger } from "../datatype/EncodableFixedInteger";
import { AbstractEncodableBitStringSection } from "./AbstractEncodableBitStringSection";

export class HeaderV1 extends AbstractEncodableBitStringSection {
  public static readonly ID = 3;
  public static readonly VERSION = 1;
  public static readonly NAME = "header";

  constructor(encodedString?: string) {
    let fields = new Map<string, AbstractEncodableBitStringDataType<any>>();
    fields.set("id", new EncodableFixedInteger(6, HeaderV1.ID));
    fields.set("version", new EncodableFixedInteger(6, HeaderV1.VERSION));
    fields.set("sectionIds", new EncodableFibonacciIntegerRange([]));

    let fieldOrder = ["id", "version", "sectionIds"];

    super(fields, fieldOrder);

    if (encodedString && encodedString.length > 0) {
      this.decode(encodedString);
    }
  }

  //Overriden
  public encode(): string {
    let bitString = this.encodeToBitString();
    let encodedString = Base64UrlEncoder.encode(bitString);
    return encodedString;
  }

  //Overriden
  public decode(encodedString: string): void {
    let bitString = Base64UrlEncoder.decode(encodedString);
    this.decodeFromBitString(bitString);
  }
}
