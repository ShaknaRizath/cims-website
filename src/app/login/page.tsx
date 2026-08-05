import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="flex flex-1 items-center justify-center bg-secondary/40 px-4 py-16">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <Link href="/" className="font-heading text-lg font-bold text-primary">
            CIMS <span className="font-normal text-foreground">Campus</span>
          </Link>
          <CardTitle className="mt-4 text-2xl">Admin sign in</CardTitle>
          <CardDescription>
            Sign in to manage programmes, news, events, and site content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm callbackUrl={callbackUrl} />
        </CardContent>
      </Card>
    </div>
  );
}
