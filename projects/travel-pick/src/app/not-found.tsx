import Link from "next/link";
export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "80px 20px" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🌿</div>
      <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>페이지를 찾을 수 없어요</h2>
      <Link href="/"><button className="btn-primary">홈으로</button></Link>
    </div>
  );
}
