// app/api/articles/rewrite/route.ts
import { NextRequest, NextResponse } from 'next/server'

const LLM_ENDPOINT = process.env.AI_API_ENDPOINT ?? 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions'
const LLM_API_KEY  = process.env.AI_API_KEY ?? ''
const DEFAULT_MODEL = process.env.AI_DEFAULT_MODEL ?? 'gemini-2.0-flash'

export async function POST(req: NextRequest) {
  const { title, body, excerpt } = await req.json().catch(() => ({}))

  if (!title && !body) {
    return NextResponse.json({ error: 'Judul atau isi artikel harus ada.' }, { status: 400 })
  }

  const currentContent = body || excerpt || ''

  const system = `Kamu adalah jurnalis senior media berita Indonesia (setara Liputan6, Detik, Kompas).
Tugas: Tulis ulang atau kembangkan artikel berita menjadi artikel lengkap dan profesional.

ATURAN PENULISAN:
- Panjang: 400–600 kata
- Bahasa Indonesia baku dan jurnalistik
- Struktur: (1) Lead paragraph kuat berisi 5W1H, (2) Tubuh berita dengan fakta & detail, (3) Kutipan narasumber jika ada, (4) Penutup berisi konteks atau dampak
- Gunakan sub-judul bold (**Sub Judul**) jika konten cukup panjang
- Jangan tambahkan kata "Artikel:" atau penjelasan di luar artikel
- Output HANYA teks artikel, tanpa judul, tanpa penjelasan tambahan`

  const user = `Judul berita: ${title}

Isi/ringkasan saat ini:
${currentContent || '(belum ada isi, buat dari judul)'}

Tulis artikel berita lengkap:`

  try {
    const res = await fetch(LLM_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LLM_API_KEY}`,
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        max_tokens: 2048,
        temperature: 0.7,
        messages: [
          { role: 'system', content: system },
          { role: 'user',   content: user },
        ],
      }),
      signal: AbortSignal.timeout(30000),
    })

    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json({ error: `AI error ${res.status}: ${err}` }, { status: 500 })
    }

    const data = await res.json()
    const newBody = data.choices?.[0]?.message?.content?.trim() ?? ''

    if (!newBody) {
      return NextResponse.json({ error: 'Respons AI kosong' }, { status: 500 })
    }

    return NextResponse.json({ body: newBody })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Gagal menghubungi AI'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
