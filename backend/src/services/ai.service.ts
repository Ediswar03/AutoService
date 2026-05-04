// src/services/ai.service.ts

import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "../config/database.config";

export class AIService {
  async chat(message: string, userId: string) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return "Fitur AI Chat belum dikonfigurasi. Silakan masukkan GEMINI_API_KEY yang valid di file .env backend dan restart server.";
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);

      // Fallback context if database query fails
      let stats = { todayWorkOrders: 0, activeWorkOrders: 0, lowStockCount: 0 };
      try {
        stats = await this.getDashboardContext();
      } catch (dbError) {
        console.error("⚠️ Dashboard context failed:", dbError);
      }

      const systemInstruction = `Anda adalah AutoService AI Assistant untuk bengkel "AutoServis".
Konteks Bengkel saat ini:
- Order Hari Ini: ${stats.todayWorkOrders}
- Pekerjaan Aktif: ${stats.activeWorkOrders}
- Stok Kritis: ${stats.lowStockCount} item

Berikan jawaban singkat, profesional, dan dalam Bahasa Indonesia.`;

      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        systemInstruction,
      });

      const result = await model.generateContent(message);
      const response = await result.response;
      const text = response.text();

      if (!text) throw new Error("Empty response from Gemini");
      return text;

    } catch (error: any) {
      console.error("❌ AI Error Details:", JSON.stringify(error, null, 2));

      const errorMsg = (error.message || "") + JSON.stringify(error?.errorDetails || "");
      if (errorMsg.includes('API_KEY_INVALID') || errorMsg.includes('400')) {
        return "API Key Gemini tidak valid. Silakan periksa nilai GEMINI_API_KEY di file .env backend.";
      }
      if (errorMsg.includes('SAFETY')) {
        return "Maaf, permintaan Anda diblokir oleh filter keamanan AI.";
      }
      if (errorMsg.includes('quota') || errorMsg.includes('429')) {
        return "Batas penggunaan (quota) AI telah habis. Silakan coba lagi nanti.";
      }
      if (errorMsg.includes('ENOTFOUND') || errorMsg.includes('network')) {
        return "Backend tidak dapat terhubung ke server Google AI. Periksa koneksi internet server Anda.";
      }

      return `Terjadi kesalahan: ${error.message || "Unknown error"}`;
    }
  }

  private async getDashboardContext() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Use raw query to compare stockQuantity <= minStock (two columns)
      const [todayWorkOrders, activeWorkOrders, lowStockResult] = await Promise.all([
        prisma.workOrder.count({ where: { createdAt: { gte: today } } }),
        prisma.workOrder.count({ where: { status: { in: ['IN_PROGRESS', 'WAITING_PARTS'] } } }),
        prisma.$queryRaw<[{ count: bigint }]>`
          SELECT COUNT(*) as count FROM spareparts 
          WHERE stock_quantity <= min_stock AND is_active = 1
        `
      ]);

      return {
        todayWorkOrders,
        activeWorkOrders,
        lowStockCount: Number(lowStockResult[0]?.count || 0)
      };
    } catch (error) {
      console.error("getDashboardContext error:", error);
      return { todayWorkOrders: 0, activeWorkOrders: 0, lowStockCount: 0 };
    }
  }
}

export const aiService = new AIService();
