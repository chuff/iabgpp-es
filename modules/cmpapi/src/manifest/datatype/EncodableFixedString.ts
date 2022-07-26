import { FixedStringEncoder } from "../../encoder/FixedStringEncoder";
import { AbstractEncodableDataType } from "./AbstractEncodableDataType";

export class EncodableFixedString extends AbstractEncodableDataType<string> {
  private stringLength: number;

  constructor(stringLength: number, value?: string) {
    super(value);
    this.stringLength = stringLength;
  }

  public encode(): string {
    return FixedStringEncoder.encode(this.value, this.stringLength);
  }

  public decode(bitString: string) {
    this.value = FixedStringEncoder.decode(bitString);
  }

  public substring(bitString: string, fromIndex: number): string {
    //TODO: validate
    return bitString.substring(fromIndex, fromIndex + this.stringLength * 6);
  }
}
