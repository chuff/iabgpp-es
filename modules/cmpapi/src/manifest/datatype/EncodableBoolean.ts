import { BooleanEncoder } from "../../encoder/BooleanEncoder";
import { AbstractEncodableBitStringDataType } from "./AbstractEncodableBitStringDataType";

export class EncodableBoolean extends AbstractEncodableBitStringDataType<boolean> {
  constructor(value?: boolean) {
    super(value);
  }

  public encode(): string {
    return BooleanEncoder.encode(this.value);
  }

  public decode(bitString: string) {
    this.value = BooleanEncoder.decode(bitString);
  }

  public substring(bitString: string, fromIndex: number): string {
    //TODO: validate
    return bitString.substring(fromIndex, fromIndex + 1);
  }
}
