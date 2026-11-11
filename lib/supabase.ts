/**
 * Zero-dependency Supabase Client for Digital To-Let BD
 * Connects to Supabase Free Tier PostgREST API seamlessly using native fetch.
 */

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL &&
  !SUPABASE_URL.includes("your-project") &&
  SUPABASE_ANON_KEY &&
  !SUPABASE_ANON_KEY.includes("your-anon-key")
);

export async function insertSupabaseFeedback(feedback: {
  name: string;
  contact: string;
  category: string;
  rating: number;
  message: string;
}) {
  if (!isSupabaseConfigured) return null;

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/feedbacks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify(feedback),
    });

    if (!res.ok) {
      console.warn("Supabase feedback insert error:", await res.text());
      return null;
    }

    return await res.json();
  } catch (err: any) {
    console.warn("Supabase fetch exception:", err.message);
    return null;
  }
}

export async function fetchSupabaseFeedbacks() {
  if (!isSupabaseConfigured) return null;

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/feedbacks?select=*&order=created_at.desc&limit=50`, {
      method: "GET",
      headers: {
        apikey: SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (err: any) {
    console.warn("Supabase fetch exception:", err.message);
    return null;
  }
}
