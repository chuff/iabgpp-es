import { FixedBitfieldEncoder } from "../../encoder/FixedBitfieldEncoder";
import { AbstractEncodableBitStringDataType } from "./AbstractEncodableBitStringDataType";

export class EncodableFlexibleBitfield extends AbstractEncodableBitStringDataType<number[]> {
  private getLength: Function;

  constructor(getLength: () => number, value?: number[]) {
    super(value);
    this.getLength = getLength;
  }

  public encode(): string {
    return FixedBitfieldEncoder.encode(this.value, this.getLength());
  }

  public decode(bitString: string) {
    this.value = FixedBitfieldEncoder.decode(bitString);
  }

  public substring(bitString: string, fromIndex: number): string {
    //TODO: validate
    return bitString.substring(fromIndex, fromIndex + this.getLength());
  }
}
