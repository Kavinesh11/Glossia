import { redirect } from "next/navigation";

export default function HomePage() {
  // UX: first-time users should land on registration directly.
  redirect("/register");
}


