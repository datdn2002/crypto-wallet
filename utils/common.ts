export function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function deferOneFrame(time = 100) {
	return new Promise<void>((resolve) => requestAnimationFrame(() => setTimeout(resolve, time)));
}