import { applyDecorators, Type } from "@nestjs/common";
import { ApiExtraModels, ApiOkResponse, ApiProperty, getSchemaPath } from "@nestjs/swagger";

export class ApiResponseType {
    @ApiProperty({
        description: "status",
        example: 200
    })
    status: number;

    @ApiProperty({
        example: "success",
        description: "status"
    })
    message?: string;
}

export const CustomApiResponse = <GenericType extends (Type<unknown>)>(data: GenericType, isArray = false) => applyDecorators(
    ApiExtraModels(ApiResponseType, data),
    ApiOkResponse({
        description: `The result of ${data?.name}`,
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponseType) },
                {
                    properties: {
                        data: !isArray ? {
                            $ref: getSchemaPath(data)
                        } : {
                            type: 'array',
                            items: {
                                $ref: getSchemaPath(data)
                            }
                        }
                    }
                }
            ]
        }
    })
);

