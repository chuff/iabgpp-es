export interface EncodableSection {
  hasField(fieldName: string): boolean;

  getFieldValue(fieldName: string): any;

  setFieldValue(fieldName: string, value: any): void;

  toObject(): any;

  encode(): string;

  decode(encodedString: string): void;
}
