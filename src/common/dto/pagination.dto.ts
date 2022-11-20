import { Type } from "class-transformer"
import { IsOptional, IsPositive, Min } from "class-validator"
import { min } from "rxjs"

export class PaginationDto {

    @IsOptional()
    @IsPositive()
    // transformar
    @Type(()=>Number)
    limit?: number

    @IsOptional()
    @Min(0)
    @Type(()=>Number)
    offset?: number
}