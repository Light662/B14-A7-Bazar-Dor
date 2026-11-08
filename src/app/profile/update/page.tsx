import Link from "next/link";
import { ProfileUpdateForm } from "@/components/profile-update-form";
import { requireSession } from "@/lib/session";

export default async function ProfileUpdatePage() {
  const session = await requireSession("/profile/update");

  return (
    <main className="page-main content-width profile-page">
      <section className="surface-card profile-card">
        <div className="profile-heading">
          <h1>তথ্য আপডেট করুন</h1>
          <p>আপনার অ্যাকাউন্টের নাম পরিবর্তন করুন।</p>
        </div>
        <ProfileUpdateForm name={session.user.name} />
        <Link className="back-home" href="/profile">← প্রোফাইলে ফিরে যান</Link>
      </section>
    </main>
  );
}
