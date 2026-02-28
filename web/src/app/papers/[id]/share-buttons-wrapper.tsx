"use client";

import ShareButtons from "@/components/ShareButtons";

interface ShareButtonsWrapperProps {
  title: string;
  paperId: string;
}

export default function ShareButtonsWrapper({ title, paperId }: ShareButtonsWrapperProps) {
  const url = typeof window !== "undefined"
    ? window.location.href
    : `https://논문읽어주는ai.com/papers/${paperId}`;

  return <ShareButtons title={title} url={url} />;
}
