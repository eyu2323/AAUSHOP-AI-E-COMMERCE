
import { GoogleGenAI, Type } from "@google/genai";
import { Product } from "../types";

// Always use named parameter and process.env.API_KEY directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  async getSmartRecommendations(query: string, products: Product[]) {
    const productContext = products.map(p => `${p.name} (ID: ${p.id}): ${p.description}`).join('\n');
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on the user's query "${query}", recommend the best products from this catalog:
      ${productContext}
      
      Suggest top 3 relevant products and explain why.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'The IDs of the recommended products.'
            },
            explanation: {
              type: Type.STRING,
              description: 'A brief explanation of why these products fit the query.'
            }
          },
          required: ["recommendedIds", "explanation"]
        }
      }
    });

    try {
      return JSON.parse(response.text || '{}');
    } catch (e) {
      console.error("Failed to parse AI response", e);
      return { recommendedIds: [], explanation: "" };
    }
  },

  async searchRealProducts(query: string) {
    // Search grounding call to find real Ethiopian products with prices in ETB
    const searchResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Find 4 real-world electronics currently popular and available for sale in Ethiopia (e.g., from retailers like Merkato, or phone stores in Addis). 
      Please ensure at least 2 of these are Infinix brand smartphones (e.g., Infinix Note, Hot, or Zero series). 
      Query context: "${query}". 
      IMPORTANT: Provide current market prices in Ethiopian Birr (ETB). Provide details including name, description, estimated price in ETB, and relevant tags.`,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    const groundingChunks = searchResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks.map((chunk: any) => ({
      title: chunk.web?.title || 'Source',
      uri: chunk.web?.uri || '#'
    })).filter(s => s.uri !== '#');

    // Second pass to structure the grounded information into JSON
    const jsonResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Convert the following grounded search information about Ethiopian products into a JSON array of product objects.
      Each object must have: name, description, price (number in ETB), currency (should be "ETB"), and tags (string array).
      
      Information:
      ${searchResponse.text}
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              price: { type: Type.NUMBER },
              currency: { type: Type.STRING },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["name", "description", "price", "currency", "tags"]
          }
        }
      }
    });

    try {
      const parsedProducts = JSON.parse(jsonResponse.text || '[]');
      return { products: parsedProducts, sources };
    } catch (e) {
      console.error("Failed to parse grounded products", e);
      return { products: [], sources: [] };
    }
  },

  async analyzeImageForSearch(base64Image: string) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image.split(',')[1] || base64Image
            }
          },
          {
            text: "Identify the electronic device in this image. Provide a concise search query (1-3 words) to find this or similar items in an electronics store. Focus on the brand or type of device if recognizable (e.g., 'iPhone', 'Gaming Laptop', 'Smart Watch')."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            searchQuery: { type: Type.STRING },
            deviceType: { type: Type.STRING }
          },
          required: ["searchQuery", "deviceType"]
        }
      }
    });

    try {
      return JSON.parse(response.text || '{}');
    } catch (e) {
      console.error("Failed to analyze image", e);
      return { searchQuery: "", deviceType: "unknown" };
    }
  },

  async generateProductIdeas(category: string) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a futuristic, high-end product idea for the category: ${category}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            price: { type: Type.NUMBER },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["name", "description", "price", "tags"]
        }
      }
    });

    try {
      return JSON.parse(response.text || '{}');
    } catch (e) {
      console.error("Failed to parse product idea", e);
      return { name: "AI Gadget", description: "A mysterious device", price: 99.99, tags: ["ai"] };
    }
  },

  async generateProductImage(prompt: string) {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `A high-quality studio product photograph of: ${prompt}. Clean white background, 4k, cinematic lighting, sharp focus.` }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    // Updated fallback to a reliable Unsplash electronic/product placeholder
    return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop';
  }
};
