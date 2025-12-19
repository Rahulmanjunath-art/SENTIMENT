
import { GoogleGenAI, Type } from "@google/genai";
import { Review, AISummaryData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeReviews = async (reviews: Review[]): Promise<AISummaryData> => {
  const reviewText = reviews.map(r => `Rating: ${r.rating}/5 - ${r.title}: ${r.comment}`).join('\n\n');

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the following product reviews and provide a summary in JSON format.
    
    Reviews:
    ${reviewText}
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING, description: 'A 2-3 sentence overall summary of the feedback.' },
          pros: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Top 3 positive points.' },
          cons: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Top 3 areas for improvement.' },
          topKeywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Relevant keywords or themes.' },
          overallSentiment: { type: Type.STRING, description: 'Overall sentiment description (e.g., Very Positive, Mixed).' }
        },
        required: ['summary', 'pros', 'cons', 'topKeywords', 'overallSentiment']
      }
    }
  });

  return JSON.parse(response.text.trim());
};

export const generateMerchantReply = async (review: Review): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `As a professional e-commerce merchant, write a short, empathetic response to this customer review. 
    Review Rating: ${review.rating} stars.
    Review Text: "${review.comment}"
    Keep it concise and helpful.`,
    config: {
      systemInstruction: "You are a polite, helpful customer service representative for a premium electronics brand."
    }
  });

  return response.text || "Thank you for your feedback! We appreciate your support.";
};

export const getReviewSentiment = async (comment: string): Promise<'positive' | 'neutral' | 'negative'> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Classify the sentiment of this review as exactly 'positive', 'neutral', or 'negative'. 
    Review: "${comment}"`,
    config: {
      responseMimeType: "text/plain"
    }
  });

  const sentiment = response.text.toLowerCase().trim();
  if (sentiment.includes('positive')) return 'positive';
  if (sentiment.includes('negative')) return 'negative';
  return 'neutral';
};
