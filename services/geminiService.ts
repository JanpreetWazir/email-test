
import { GoogleGenAI, Type } from "@google/genai";
import type { DesignSuggestion } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        description: {
            type: Type.STRING,
            description: "A general description of the proposed design changes, focusing on the overall mood and style."
        },
        colorPalette: {
            type: Type.ARRAY,
            description: "A list of 4-5 complementary colors for the room.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "A descriptive name for the color (e.g., 'Warm Beige')." },
                    hex: { type: Type.STRING, description: "The hexadecimal code for the color (e.g., '#F5F5DC')." }
                },
                required: ["name", "hex"]
            }
        },
        items: {
            type: Type.ARRAY,
            description: "A list of 3-5 key furniture or decor items to add or change.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "The name of the item (e.g., 'Mid-Century Modern Sofa')." },
                    reason: { type: Type.STRING, description: "A brief reason why this item fits the style and room." }
                },
                required: ["name", "reason"]
            }
        }
    },
    required: ["description", "colorPalette", "items"]
};


export const getDesignSuggestions = async (
    imageBase64: string,
    mimeType: string,
    style: string
): Promise<DesignSuggestion> => {
    
    const prompt = `You are an expert interior designer. Analyze this image of a room and provide design suggestions in the '${style}' style. Your suggestions should be practical and inspiring. Provide a general description, a list of key furniture/decor items with reasons, and a suitable hex color palette.`;

    const imagePart = {
        inlineData: {
            data: imageBase64,
            mimeType: mimeType,
        },
    };

    const textPart = {
        text: prompt,
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.7,
                topP: 0.95,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);

        return parsedJson as DesignSuggestion;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get design suggestions from the AI.");
    }
};
