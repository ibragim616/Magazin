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
      ? `Hozirda foydalanuvchining savatchasida quyidagi mahsulotlar bor:\n${cartItems.map((item: any) => `- ${item.name} (${item.quantity} ta) - Narxi: ${item.price} so'm`).join('\n')}\nFoydalanuvchi asosan shu mahsulotlar bo'yicha savol bersa, ularga to'liq va foydali ma'lumotlarni taqdim eting.`
      : `Hozirda foydalanuvchi savatchasida hech qanday mahsulot yo'q.`;

    const systemPrompt = `Sen "UzMarket" nomli elektron tijorat saytining sun'iy intellekt maslahatchisisan. 
Vazifang foydalanuvchilarga mahsulotlar bo'yicha ma'lumot berish va savollariga o'zbek tilida do'stona javob qaytarishdir.
${cartContext}
Javoblaringiz qisqa, tushunarli va professional bo'lsin.`;

    const result = streamText({
      model: openai('gpt-4o-mini'),
      system: systemPrompt,
      messages: messages as any[],
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Chat API xatosi:', error);
    return new Response(JSON.stringify({ error: 'Xatolik yuz berdi' }), { status: 500 });
  }
}
