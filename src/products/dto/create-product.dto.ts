import { IsArray, IsIn, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator"

export class CreateProductDto {
    
    @IsString()
    @MinLength(1)
    title: string

    @IsOptional()
    @IsPositive()
    @IsNumber()
    price?: number

    @IsString()
    @IsOptional()
    description?: string

    @IsString()
    @IsOptional()
    slug?: string

    @IsOptional()
    @IsPositive()
    @IsNumber()
    stock?: number

    @IsString( {each: true} )
    @IsArray()
    sizes: string[]

    @IsIn(['men', 'women','kid', 'unisex'])
    gender: string

    @IsString( {each: true} )
    @IsArray()
    @IsOptional()
    tags: string[]


}
