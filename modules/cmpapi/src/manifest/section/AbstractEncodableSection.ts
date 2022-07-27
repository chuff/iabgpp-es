import { EncodableSection } from "./EncodableSection";

export abstract class AbstractEncodableSection implements EncodableSection {
  protected fields = new Map<String, any>();

  //Overriden
  public hasField(fieldName: string): boolean {
    return this.fields.has(fieldName);
  }

  //Overriden
  public getFieldValue(fieldName: string): any {
    if (this.fields.has(fieldName)) {
      return this.fields.get(fieldName);
    } else {
      throw new Error("Field not found: '" + fieldName + "'");
    }
  }

  //Overriden
  public setFieldValue(fieldName: string, value: any): void {
    if (this.fields.has(fieldName)) {
      this.fields.set(fieldName, value);
    } else {
      throw new Error("Field not found: '" + fieldName + "'");
    }
  }

  //Overriden
  public toObject() {
    let obj = {};
    for (const fieldName of this.fields.keys()) {
      let value = this.fields.get(fieldName);
      if (value) {
        obj[fieldName.toString()] = value;
      }
    }

    return obj;
  }

  //Overriden
  public abstract encode(): string;

  //Overriden
  public abstract decode(encodedString: string): void;
}
