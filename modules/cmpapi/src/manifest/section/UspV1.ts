import { Base64UrlEncoder } from "../../encoder/Base64UrlEncoder";
import { AbstractEncodableBitStringDataType } from "../datatype/AbstractEncodableBitStringDataType";
import { EncodableFixedInteger } from "../datatype/EncodableFixedInteger";
import { AbstractEncodableBitStringSection } from "./AbstractEncodableBitStringSection";

export class UspV1 extends AbstractEncodableBitStringSection {
  public static readonly ID = 7;
  public static readonly VERSION = 1;
  public static readonly NAME = "uspv1";

  constructor(encodedString?: string) {
    let fields = new Map<string, AbstractEncodableBitStringDataType<any>>();
    fields.set("version", new EncodableFixedInteger(6, UspV1.VERSION));
    fields.set("notice", new EncodableFixedInteger(2));
    fields.set("optOutSale", new EncodableFixedInteger(2));
    fields.set("lspaCovered", new EncodableFixedInteger(2));

    let fieldOrder = ["version", "notice", "optOutSale", "lspaCovered"];

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
