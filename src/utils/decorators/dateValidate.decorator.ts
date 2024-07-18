import {
	registerDecorator,
	ValidationArguments,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface
} from "class-validator";

@ValidatorConstraint({ async: true })
export class IsValidateDateContraint implements ValidatorConstraintInterface {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	validate(value: string, args: ValidationArguments) {
		const regex = new RegExp(
			/^((19|20)[0-9]{2})-(0[0-9]|1[0-2])-([0-2][0-9]|3[0-1])$/
		);
		if (regex.test(value)) {
			const date = new Date(value);
			return date.toISOString().substring(0, 10) === value;
		}
	}
}

export function Validate(validationOptions?: ValidationOptions) {
	return function (object: object, propertyDate: string) {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyDate,
			options: validationOptions,
			constraints: [],
			validator: IsValidateDateContraint
		});
	};
}
