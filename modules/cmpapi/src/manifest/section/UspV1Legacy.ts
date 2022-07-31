import { Gvl } from "../../Gvl.js";
import { EncodableSection } from "./EncodableSection.js";

export class UspV1Legacy implements EncodableSection {
  public static readonly ID = 6;
  public static readonly VERSION = 1;
  public static readonly NAME = "uspv1";

  protected fields: Map<String, any>;

  constructor(encodedString?: string) {
    this.fields = new Map<String, any>();
    this.fields.set("version", UspV1Legacy.VERSION);
    this.fields.set("notice", "-");
    this.fields.set("optOutSale", "-");
    this.fields.set("lspaCovered", "-");

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
      console.log(fieldName + " not found");
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
    str += this.getFieldValue("version");
    str += this.getFieldValue("notice");
    str += this.getFieldValue("optOutSale");
    str += this.getFieldValue("lspaCovered");
    return str;
  }

  //Overriden
  public decode(encodedString: string) {
    //TODO: validate
    this.setFieldValue("version", parseInt(encodedString.charAt(0)));
    this.setFieldValue("notice", encodedString.charAt(1));
    this.setFieldValue("optOutSale", encodedString.charAt(2));
    this.setFieldValue("lspaCovered", encodedString.charAt(3));
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
