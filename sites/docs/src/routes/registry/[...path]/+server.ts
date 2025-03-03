import { json } from "@sveltejs/kit";

export async function GET({ params }) {
	const { path } = params;

	try {
		const jsonFiles = import.meta.glob("../../../lib/registry-json/**/*.json", { as: "raw" });
		const cssFiles = import.meta.glob("../../../lib/registry-css/**/*.css", { as: "raw" });

		const modules = { ...jsonFiles, ...cssFiles };

		const modulePath = Object.keys(modules).find((m) => m.endsWith(`/${path}`));

		if (!modulePath) {
			throw new Error(`File not found: ${path}`);
		}

		const rawContent = await modules[modulePath]();

		return new Response(rawContent, {
			headers: {
				"Content-Type": "application/json",
				"Cache-Control": "no-store, max-age=0",
			},
		});
	} catch (error) {
		console.error(error);
		return json({ error: "Resource not found" }, { status: 404 });
	}
}
