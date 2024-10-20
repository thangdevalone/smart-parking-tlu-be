import { ArrayNotEmpty, IsArray, IsNumber } from "class-validator";

export * from "./pagination";
export * from "./role";
export * from "./system";
export * from "./card";
export * from "./bill";
export * from "./queue";

export class DeleteMultipleDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  ids: number[];
}