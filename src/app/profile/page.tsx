import Link from "next/link";
import { requireSession } from "@/lib/session";

export default async function ProfilePage() {
  const session = await requireSession("/profile");
  const name = session.user.name || session.user.email;

  return (
    <main className="page-main content-width profile-page">
      <section className="surface-card profile-card">
        <div className="profile-heading">
          <h1>আমার প্রোফাইল</h1>
          <p>আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।</p>
        </div>
        <div className="profile-summary">
          <span className="avatar avatar-large">
            {session.user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img alt="" src={session.user.image} />
            ) : (
              name.slice(0, 1)
            )}
          </span>
          <div className="profile-user">
            <strong>{name}</strong>
            <span>{session.user.email}</span>
          </div>
        </div>
        <div className="profile-info">
          <h2>তথ্য</h2>
          <div>
            <span>নাম</span>
            <strong>{name}</strong>
          </div>
          <div>
            <span>ইমেইল</span>
            <strong>{session.user.email}</strong>
          </div>
        </div>
        <Link className="button button-primary" href="/profile/update">
          তথ্য আপডেট করুন
        </Link>
      </section>
    </main>
  );
}
