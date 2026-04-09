export function createCheatkeyScope() {
  const saveData = async (table: string, data: Record<string, unknown>) => {
    const res = await fetch(`/api/cheatkey/${table}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "저장 실패");
    }
    return res.json();
  };

  const loadData = async (table: string, filter?: Record<string, unknown>) => {
    const params = filter
      ? `?filter=${encodeURIComponent(JSON.stringify(filter))}`
      : "";
    const res = await fetch(`/api/cheatkey/${table}${params}`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "조회 실패");
    }
    return res.json();
  };

  const me = () => {
    // Set by canvas page on mount
    return (
      (typeof window !== "undefined" &&
        (window as unknown as Record<string, unknown>).__sandbox_user) || {
        id: "unknown",
        email: "unknown",
      }
    );
  };

  return { saveData, loadData, me };
}
