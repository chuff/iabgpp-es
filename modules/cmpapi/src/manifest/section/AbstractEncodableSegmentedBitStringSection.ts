import { AbstractEncodableBitStringDataType } from "../datatype/AbstractEncodableBitStringDataType";
import { EncodableSection } from "./EncodableSection";

export abstract class AbstractEncodableSegmentedBitStringSection implements EncodableSection {
  protected fields: Map<string, AbstractEncodableBitStringDataType<any>>;
  protected segments: string[][];

  constructor(fields: Map<string, AbstractEncodableBitStringDataType<any>>, segments: string[][]) {
    this.fields = fields;
    this.segments = segments;
  }

  //Overriden
  public hasField(fieldName: string): boolean {
    return this.fields.has(fieldName);
  }

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

  public getSegments() {
    return this.segments;
  }

  public encodeSegmentsToBitStrings(): string[] {
    let segmentBitStrings = [];
    for (let i = 0; i < this.segments.length; i++) {
      let segmentBitString = "";
      for (let j = 0; j < this.segments[i].length; j++) {
        let fieldName = this.segments[i][j];
        if (this.fields.has(fieldName)) {
          let field = this.fields.get(fieldName);
          segmentBitString += field.encode();
        } else {
          throw new Error("Field not found: '" + fieldName + "'");
        }
      }
      segmentBitStrings.push(segmentBitString);
    }

    return segmentBitStrings;
  }

  public decodeSegmentsFromBitStrings(segmentBitStrings: string[]) {
    for (let i = 0; i < this.segments.length && i < segmentBitStrings.length; i++) {
      let segmentBitString = segmentBitStrings[i];
      if (segmentBitString && segmentBitString.length > 0) {
        let index = 0;
        for (let j = 0; j < this.segments[i].length; j++) {
          let fieldName = this.segments[i][j];
          if (this.fields.has(fieldName)) {
            let field = this.fields.get(fieldName);
            let substring = field.substring(segmentBitString, index);
            field.decode(substring);
            index += substring.length;
          } else {
            throw new Error("Field not found: '" + fieldName + "'");
          }
        }
      }
    }
  }

  //Overriden
  public toObject() {
    let obj = {};
    for (let i = 0; i < this.segments.length; i++) {
      for (let j = 0; j < this.segments[i].length; j++) {
        let fieldName = this.segments[i][j];
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
    }
    return obj;
  }

  //Overriden
  public abstract encode(): string;

  //Overriden
  public abstract decode(encodedString: string): void;
}
