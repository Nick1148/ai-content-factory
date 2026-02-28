"use server";

import { createClient } from "@supabase/supabase-js";

export async function subscribeNewsletter(email: string): Promise<{ success: boolean; message: string }> {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return { success: false, message: "유효한 이메일 주소를 입력해주세요." };
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return { success: false, message: "서버 설정 오류입니다. 잠시 후 다시 시도해주세요." };
  }

  const supabase = createClient(url, key);
  const { error } = await supabase
    .from("newsletter_subscribers")
    .upsert({ email, status: "active" }, { onConflict: "email" });

  if (error) {
    console.error("[Newsletter] 구독 처리 실패:", error.message);
    return { success: false, message: "구독 처리에 실패했습니다. 잠시 후 다시 시도해주세요." };
  }

  return { success: true, message: "구독이 완료되었습니다!" };
}
