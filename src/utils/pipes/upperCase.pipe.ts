import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class UpperCasePipe implements PipeTransform {
	transform(value: any) {
		console.log(value);

		if (value) {
			for (const i in value) {
				value[i] = value[i].toUpperCase();
			}

			return value;
		}
		throw new BadRequestException("validação falhou!");
	}
}
