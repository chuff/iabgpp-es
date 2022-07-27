import { AbstractEncodableSection } from "./AbstractEncodableSection";

export class UspV1Legacy extends AbstractEncodableSection {
  public static readonly ID = 6;
  public static readonly VERSION = 1;
  public static readonly NAME = "uspv1";

  constructor(encodedString?: string) {
    super();

    this.fields.set("version", UspV1Legacy.VERSION);
    this.fields.set("notice", "-");
    this.fields.set("optOutSale", "-");
    this.fields.set("lspaCovered", "-");

    if (encodedString && encodedString.length > 0) {
      this.decode(encodedString);
    }
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
}
