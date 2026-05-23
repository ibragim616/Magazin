 
 
 
 
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    console.log('Chat API received payload:', payload);
    const { messages, data } = payload;

    const cartItems = data?.cartItems || [];

    const cartContext = cartItems.length > 0
    ? `Hozirda foydalanuvchining savatchasida quyidagi mahsulotlar bor:\n${cartItems.map((item: { name: string; quantity: number; price: number }) => `- ${item.name} (${item.quantity} ta) - Narxi: ${item.price} so'm`).join('\n')}\nFoydalanuvchi asosan shu mahsulotlar bo'yicha savol bersa, ularga to'liq va foydali ma'lumotlarni taqdim eting.`
    : `Hozirda foydalanuvchi savatchasida hech qanday mahsulot yo'q.`;

  const systemPrompt = `Siz UzMarket onlayn do'koni uchun yordamchi AI maslahatchisiz. 
${cartContext}
Iltimos, har doim do'stona, o'zbek tilida va faqat mahsulotlar, xaridlar haqida yordam bering.
Qisqa va aniq javob qaytaring.`;

    const result = streamText({
      model: openai('gpt-4o-mini'),
      system: systemPrompt,
      messages: messages as unknown[],
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Chat API xatosi:', error);
    return new Response(JSON.stringify({ error: 'Xatolik yuz berdi' }), { status: 500 });
  }
}
