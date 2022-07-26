import { FibonacciIntegerRangeEncoder } from "../../encoder/FibonacciIntegerRangeEncoder";
import { FixedBitfieldEncoder } from "../../encoder/FixedBitfieldEncoder";
import { FixedIntegerEncoder } from "../../encoder/FixedIntegerEncoder";
import { AbstractEncodableDataType } from "./AbstractEncodableDataType";
import { EncodableFibonacciIntegerRange } from "./EncodableFibonacciIntegerRange";

export class EncodableOptimizedFibonacciRange extends AbstractEncodableDataType<number[]> {
  constructor(value?: number[]) {
    super(value);
  }

  public encode(): string {
    //TODO: encoding the range before choosing the shortest is inefficient. There is probably a way
    //to identify in advance which will be shorter based on the array length and values
    let max = this.value.length > 0 ? this.value[this.value.length - 1] : 0;
    let rangeBitString = FibonacciIntegerRangeEncoder.encode(this.value);
    let rangeLength = rangeBitString.length;
    let bitFieldLength = max;

    if (rangeLength <= bitFieldLength) {
      return "1" + FixedIntegerEncoder.encode(max, 16) + rangeBitString;
    } else {
      let bits = [];
      let index = 0;
      for (let i = 0; i < max; i++) {
        if (i == this.value[index] - 1) {
          bits[i] = 1;
          index++;
        } else {
          bits[i] = 0;
        }
      }
      return "0" + FixedIntegerEncoder.encode(max, 16) + FixedBitfieldEncoder.encode(bits, bitFieldLength);
    }
  }

  public decode(bitString: string) {
    if (bitString.charAt(16) == "1") {
      this.value = FibonacciIntegerRangeEncoder.decode(bitString.substring(17));
    } else {
      let value = [];
      let bits = FixedBitfieldEncoder.decode(bitString.substring(17));
      for (let i = 0; i < bits.length; i++) {
        if (bits[i] == 1) {
          value.push(i + 1);
        }
      }
      this.value = value;
    }
  }

  public substring(bitString: string, fromIndex: number): string {
    let max = FixedIntegerEncoder.decode(bitString.substring(fromIndex, fromIndex + 16));
    if (bitString.charAt(fromIndex + 16) == "1") {
      return (
        bitString.substring(fromIndex, 17) + new EncodableFibonacciIntegerRange().substring(bitString, fromIndex + 17)
      );
    } else {
      return bitString.substring(fromIndex, fromIndex + 17 + max);
    }
  }
}
