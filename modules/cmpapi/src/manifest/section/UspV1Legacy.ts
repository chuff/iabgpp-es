import { Gvl } from "../../Gvl.js";
import { EncodableSection } from "./EncodableSection.js";

// Deprecated
export class UspV1Legacy implements EncodableSection {
  public static readonly ID = 6;
  public static readonly VERSION = 1;
  public static readonly NAME = "uspv1";

  protected fields: Map<String, any>;

  constructor(encodedString?: string) {
    this.fields = new Map<String, any>();
    this.fields.set("Version", UspV1Legacy.VERSION);
    this.fields.set("Notice", "-");
    this.fields.set("OptOutSale", "-");
    this.fields.set("LspaCovered", "-");

    if (encodedString && encodedString.length > 0) {
      this.decode(encodedString);
    }
  }

  //Overriden
  public hasField(fieldName: string): boolean {
    return this.fields.has(fieldName);
  }

  //Overriden
  public getFieldValue(fieldName: string): any {
    if (this.fields.has(fieldName)) {
      return this.fields.get(fieldName);
    } else {
      return null;
    }
  }

  //Overriden
  public setFieldValue(fieldName: string, value: any): void {
    if (this.fields.has(fieldName)) {
      this.fields.set(fieldName, value);
    } else {
      throw new Error(fieldName + " not found");
    }
  }

  //Overriden
  public toObject() {
    let obj = {};
    for (const fieldName of this.fields.keys()) {
      let value = this.fields.get(fieldName);
      obj[fieldName.toString()] = value;
    }

    return obj;
  }

  //Overriden
  public encode() {
    let str = "";
    str += this.getFieldValue("Version");
    str += this.getFieldValue("Notice");
    str += this.getFieldValue("OptOutSale");
    str += this.getFieldValue("LspaCovered");
    return str;
  }

  //Overriden
  public decode(encodedString: string) {
    //TODO: validate
    this.setFieldValue("Version", parseInt(encodedString.charAt(0)));
    this.setFieldValue("Notice", encodedString.charAt(1));
    this.setFieldValue("OptOutSale", encodedString.charAt(2));
    this.setFieldValue("LspaCovered", encodedString.charAt(3));
  }

  //Overriden
  public getId(): number {
    return UspV1Legacy.ID;
  }

  //Overriden
  public getName(): string {
    return UspV1Legacy.NAME;
  }
}
