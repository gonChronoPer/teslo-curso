import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
    
    @IsOptional()
    @IsPositive()
    // Transformar
    @Type( () => Number) //enableImplicitCOnversions: true
    limit?: number;

    @IsOptional()
    @Min(0)
    // Transformar
    @Type( () => Number) //enableImplicitCOnversions: true
    offset?: number;
}