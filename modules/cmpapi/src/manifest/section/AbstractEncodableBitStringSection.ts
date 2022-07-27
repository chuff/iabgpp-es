import { AbstractEncodableBitStringDataType } from "../datatype/AbstractEncodableBitStringDataType";
import { EncodableSection } from "./EncodableSection";

export abstract class AbstractEncodableBitStringSection implements EncodableSection {
  protected fields: Map<string, AbstractEncodableBitStringDataType<any>>;
  protected fieldOrder: string[];

  constructor(fields: Map<string, AbstractEncodableBitStringDataType<any>>, fieldOrder: string[]) {
    this.fields = fields;
    this.fieldOrder = fieldOrder;
  }

  //Overriden
  public hasField(fieldName: string): boolean {
    return this.fields.has(fieldName);
  }

  //Overriden
  public getField(fieldName: string): AbstractEncodableBitStringDataType<any> {
    if (this.fields.has(fieldName)) {
      return this.fields.get(fieldName);
    } else {
      throw new Error("Field not found: '" + fieldName + "'");
    }
  }

  //Overriden
  public getFieldValue(fieldName: string): any {
    if (this.fields.has(fieldName)) {
      return this.fields.get(fieldName).getValue();
    } else {
      throw new Error("Field not found: '" + fieldName + "'");
    }
  }

  //Overriden
  public setFieldValue(fieldName: string, value: any): void {
    if (this.fields.has(fieldName)) {
      this.fields.get(fieldName).setValue(value);
    } else {
      throw new Error("Field not found: '" + fieldName + "'");
    }
  }

  public getFieldOrder() {
    return this.fieldOrder;
  }

  public encodeToBitString(): string {
    let bitString = "";
    for (let i = 0; i < this.fieldOrder.length; i++) {
      let fieldName = this.fieldOrder[i];
      if (this.fields.has(fieldName)) {
        let field = this.fields.get(fieldName);
        bitString += field.encode();
      } else {
        throw new Error("Field not found: '" + fieldName + "'");
      }
    }

    return bitString;
  }

  public decodeFromBitString(bitString: string) {
    let index = 0;
    for (let i = 0; i < this.fieldOrder.length; i++) {
      let fieldName = this.fieldOrder[i];
      if (this.fields.has(fieldName)) {
        let field = this.fields.get(fieldName);
        let substring = field.substring(bitString, index);
        field.decode(substring);
        index += substring.length;
      } else {
        throw new Error("Field not found: '" + fieldName + "'");
      }
    }
  }

  //Overriden
  public toObject() {
    let obj = {};
    for (let i = 0; i < this.fieldOrder.length; i++) {
      let fieldName = this.fieldOrder[i];
      if (this.fields.has(fieldName)) {
        let field = this.fields.get(fieldName);
        let value = field.getValue();
        if (value) {
          obj[fieldName] = value;
        }
      } else {
        throw new Error("Field not found: '" + fieldName + "'");
      }
    }
    return obj;
  }

  //Overriden
  public abstract encode(): string;

  //Overriden
  public abstract decode(encodedString: string): void;
}
