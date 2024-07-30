import { Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class UpperCasePipe implements PipeTransform {
	transform(value: any) {
		switch (typeof value) {
			case "number":
				return value;
				break;
			case "string":
				return value.toUpperCase();
				break;
			case "object":
				Object.keys(value).forEach(
					(key) => (value[key] = this.transform(value[key]))
				);
		}
		if (Array.isArray(value)) value = value.map((v) => this.transform(v));
		return value;
	}
}
