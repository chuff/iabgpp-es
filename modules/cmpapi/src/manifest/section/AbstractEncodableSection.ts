import { Base64UrlEncoder } from "../../encoder/Base64UrlEncoder";
import { AbstractEncodableDataType } from "../datatype/AbstractEncodableDataType";

export abstract class AbstractEncodableSection {
  protected fields: Map<string, AbstractEncodableDataType<any>>;
  protected segments: string[][];

  constructor(fields: Map<string, AbstractEncodableDataType<any>>, segments: string[][]) {
    this.fields = fields;
    this.segments = segments;
  }

  public hasField(fieldName: string): boolean {
    return this.fields.has(fieldName);
  }

  public getField(fieldName: string): AbstractEncodableDataType<any> {
    if (this.fields.has(fieldName)) {
      return this.fields.get(fieldName);
    } else {
      throw new Error("Field not found: '" + fieldName + "'");
    }
  }

  public getFieldValue(fieldName: string): any {
    if (this.fields.has(fieldName)) {
      return this.fields.get(fieldName).getValue();
    } else {
      throw new Error("Field not found: '" + fieldName + "'");
    }
  }

  public setFieldValue(fieldName: string, value: any): void {
    if (this.fields.has(fieldName)) {
      return this.fields.get(fieldName).setValue(value);
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

  // This method assumes all segments are always included.
  // The implementing section class can override this method if a more specific implementation is needed.
  public encode() {
    let segmentBitStrings = this.encodeSegmentsToBitStrings();
    let base64EncodedSegments = [];
    for (let i = 0; i < segmentBitStrings.length; i++) {
      base64EncodedSegments.push(Base64UrlEncoder.encode(segmentBitStrings[i]));
    }
    return base64EncodedSegments.join(".");
  }

  // This method assumes all segments are always included.
  // The implementing section class can override this method if a more specific implementation is needed.
  public decode(base64EncodedSection: string) {
    let base64EncodedSegments = base64EncodedSection.split(".");
    let segmentBitStrings = [];
    for (let i = 0; i < base64EncodedSegments.length; i++) {
      segmentBitStrings.push(Base64UrlEncoder.decode(base64EncodedSegments[i]));
    }
    this.decodeSegmentsFromBitStrings(segmentBitStrings);
  }
}
