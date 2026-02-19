
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
        }

        const token = process.env.HUGGING_FACE_TOKEN;

        if (!token) {
            return NextResponse.json(
                { error: "Missing Token: Add HUGGING_FACE_TOKEN to .env.local" },
                { status: 500 }
            );
        }

        // Updated for 2026/2027 compatibility
        // The old 'api-inference.huggingface.co' is deprecated, now we use 'router.huggingface.co'

        const models = [
            "black-forest-labs/FLUX.1-schnell", // Fast, often the standard now
            "stabilityai/stable-diffusion-xl-base-1.0", // High quality fallback
            "prompthero/openjourney", // Artistic
            "runwayml/stable-diffusion-v1-5" // Legacy
        ];

        let lastError = null;
        let successfulModel = "";
        let finalResponse = null;

        for (const model of models) {
            console.log(`Attempting model: ${model} via Router API`);

            // Critical Fix: Using the new router endpoint
            const apiUrl = `https://router.huggingface.co/hf-inference/models/${model}`;

            try {
                const response = await fetch(apiUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                    body: JSON.stringify({ inputs: prompt }),
                });

                if (response.ok) {
                    console.log(`Success with model: ${model}`);
                    successfulModel = model;
                    finalResponse = response;
                    break;
                } else {
                    const errorText = await response.text();
                    console.warn(`Model ${model} failed (${response.status}): ${errorText}`);
                    lastError = { status: response.status, message: errorText };

                    // Stop on auth error
                    if (response.status === 401 || response.status === 403) {
                        throw new Error(`Auth Error (${response.status}): Check your Token permissions.`);
                    }
                }
            } catch (err: any) {
                console.error(`Error with ${model}:`, err);
                lastError = { status: 500, message: err.message };
                if (err.message.includes("Auth Error")) break;
            }
        }

        if (!finalResponse || !finalResponse.ok) {
            const status = lastError?.status || 500;
            const msg = lastError?.message || "All models failed.";
            return NextResponse.json(
                { error: `Generation Failed. Reason: ${msg}` },
                { status: status }
            );
        }

        const imageBlob = await finalResponse.blob();
        const arrayBuffer = await imageBlob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        return new NextResponse(buffer, {
            headers: {
                "Content-Type": "image/jpeg",
                "Cache-Control": "public, max-age=3600",
                "X-Generated-By": successfulModel,
            },
        });

    } catch (error: any) {
        console.error("Server Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
