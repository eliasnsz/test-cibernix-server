export function bad<const T>(error: T) {
	return [error] as [T];
}

export function nice<const T = undefined>(result?: T) {
	return [undefined, result] as [undefined, T];
}

export class Fail<
	const TCode = string,
	const TPayload = Record<string, unknown>,
> {
	readonly code: TCode;
	readonly payload: TPayload;

	constructor(props: FailProps<TCode, TPayload>) {
		this.code = props.code;
		this.payload = props.payload;
	}

	static create<const TCode = string, const TPayload = Record<string, unknown>>(
		code: TCode,
		payload: TPayload,
	) {
		return new Fail({
			code,
			payload,
		});
	}
}

type FailProps<TCode = string, TPayload = Record<string, unknown>> = {
	code: TCode;
	payload: TPayload;
};
