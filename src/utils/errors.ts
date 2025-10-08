export class NotFoundError extends Error {}
export class BadRequestError extends Error {}
export class UnauthorizedError extends Error {}
export class ForbiddenError extends Error {}

export class HttpError extends Error {
	status: number;
	constructor (message: string, status = 400) {
		super(message);
		this.status = status;
	};
};