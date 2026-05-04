import type { Metadata } from "next";
import { DUMMY_PARTIES } from "@/lib/dummy-parties";
import { HOBBY_CATEGORIES } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const party = DUMMY_PARTIES.find((p) => p.id === id);
  if (!party) return { title: "파티를 찾을 수 없어요 | 제주패스" };

  const cat = HOBBY_CATEGORIES.find((c) => c.id === party.category);
  const spotsLeft = party.maxMembers - party.currentMembers;
  const desc = `${party.region}에서 ${cat?.label} 파티! ${party.description.slice(0, 120)}`;

  return {
    title: `${party.title} | 제주 취미 파티`,
    description: desc,
    keywords: [
      party.region,
      cat?.label ?? "",
      "제주 파티",
      "제주 모임",
      "제주 여행 친구",
      "제주패스",
      ...party.tags,
    ],
    openGraph: {
      title: party.title,
      description: desc,
      type: "article",
      siteName: "제주패스",
      locale: "ko_KR",
    },
    twitter: {
      card: "summary",
      title: party.title,
      description: desc,
    },
    other: {
      "application/ld+json": JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Event",
        name: party.title,
        description: party.description,
        startDate: `${party.date}T${party.time}:00+09:00`,
        location: {
          "@type": "Place",
          name: party.location,
          address: { "@type": "PostalAddress", addressLocality: party.region, addressCountry: "KR" },
        },
        organizer: { "@type": "Person", name: party.hostName },
        remainingAttendeeCapacity: spotsLeft,
        maximumAttendeeCapacity: party.maxMembers,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        isAccessibleForFree: party.costType === "free",
      }),
    },
  };
}

export default function PartyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
