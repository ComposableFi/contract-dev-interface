export async function getWasm(dir: string): Promise<WebAssembly.Exports> {
	if (!window?.WebAssembly) throw new Error('Wasm currently unavailable in client');
	const res = await fetch(dir);
	const buffer = await res.arrayBuffer();
	const wasm = await window.WebAssembly.instantiate(buffer);
	//  wasm.instance.exports.[functionName];
	return wasm.instance.exports;
}
