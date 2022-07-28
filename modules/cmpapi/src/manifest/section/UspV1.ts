import { Base64UrlEncoder } from "../../encoder/Base64UrlEncoder.js";
import { GVL } from "../../gvl/GVL.js";
import { AbstractEncodableBitStringDataType } from "../datatype/AbstractEncodableBitStringDataType.js";
import { EncodableFixedInteger } from "../datatype/EncodableFixedInteger.js";
import { AbstractEncodableBitStringSection } from "./AbstractEncodableBitStringSection.js";

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

  //Overriden
  public getGvl(): GVL {
    throw new Error("GVL is not supported for '" + UspV1.NAME + "'");
  }

  //Overriden
  public setGvl(gvl: GVL): void {
    throw new Error("GVL is not supported for '" + UspV1.NAME + "'");
  }

  //Overriden
  public getId(): number {
    return UspV1.ID;
  }

  //Overriden
  public getName(): string {
    return UspV1.NAME;
  }
}
