import { FixedBitfieldEncoder } from "../../encoder/FixedBitfieldEncoder";
import { AbstractEncodableDataType } from "./AbstractEncodableDataType";

export class EncodableFixedBitfield extends AbstractEncodableDataType<number[]> {
  private bitStringLength: number;

  constructor(bitStringLength: number, value?: number[]) {
    super(value);
    this.bitStringLength = bitStringLength;
  }

  public encode(): string {
    return FixedBitfieldEncoder.encode(this.value, this.bitStringLength);
  }

  public decode(bitString: string) {
    this.value = FixedBitfieldEncoder.decode(bitString);
  }

  public substring(bitString: string, fromIndex: number): string {
    //TODO: validate
    return bitString.substring(fromIndex, fromIndex + this.bitStringLength);
  }
}
