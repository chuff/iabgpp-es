import { DatetimeEncoder } from "../../encoder/DatetimeEncoder";
import { AbstractEncodableDataType } from "./AbstractEncodableDataType";

export class EncodableDatetime extends AbstractEncodableDataType<Date> {
  constructor(value?: Date) {
    super(value);
  }

  public encode(): string {
    return DatetimeEncoder.encode(this.value);
  }

  public decode(bitString: string) {
    this.value = DatetimeEncoder.decode(bitString);
  }

  public substring(bitString: string, fromIndex: number): string {
    //TODO: validate
    return bitString.substring(fromIndex, fromIndex + 36);
  }
}
