import { FibonacciIntegerEncoder } from "../../encoder/FibonacciIntegerEncoder";
import { AbstractEncodableDataType } from "./AbstractEncodableDataType";

export class EncodableFibonacciInteger extends AbstractEncodableDataType<number> {
  constructor(value?: number) {
    super(value);
  }

  public encode(): string {
    return FibonacciIntegerEncoder.encode(this.value);
  }

  public decode(bitString: string) {
    this.value = FibonacciIntegerEncoder.decode(bitString);
  }

  public substring(bitString: string, fromIndex: number): string {
    let index = bitString.indexOf("11", fromIndex);
    if (index > 0) {
      return bitString.substring(fromIndex, index + 2);
    } else {
      return bitString;
    }
  }
}
