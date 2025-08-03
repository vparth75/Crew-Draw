import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen flex gap-5">
      <Link href="/signin">
        <button>Sign in</button>
      </Link>
      <Link href="/signup">
        <button>Sign up</button>
      </Link>
    </div>
  );
}
