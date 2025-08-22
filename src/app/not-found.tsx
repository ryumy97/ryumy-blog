import { TransitionIn } from "@/components/TransitionTunnel";

export default function NotFound() {
  return (
    <TransitionIn>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">404 Not Found</h1>
        <p className="text-muted-foreground">페이지를 찾을 수 없습니다.</p>
      </div>
    </TransitionIn>
  );
}
