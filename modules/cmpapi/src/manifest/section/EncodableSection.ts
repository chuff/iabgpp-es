import { GVL } from "../../gvl/GVL.js";

export interface EncodableSection {
  getId(): number;

  getName(): string;

  hasField(fieldName: string): boolean;

  getFieldValue(fieldName: string): any;

  setFieldValue(fieldName: string, value: any): void;

  toObject(): any;

  encode(): string;

  decode(encodedString: string): void;

  getGvl(): GVL;

  setGvl(gvl: GVL): void;
}
