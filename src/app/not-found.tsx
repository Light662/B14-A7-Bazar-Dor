import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-main content-width not-found-page">
      <span className="not-found-code">৪০৪</span>
      <h1>পৃষ্ঠাটি খুঁজে পাওয়া যায়নি</h1>
      <p>ঠিকানাটি ভুল হতে পারে, অথবা এই তথ্যটি আর উপলভ্য নেই।</p>
      <Link className="button button-primary" href="/">হোম পেজে ফিরে যান</Link>
    </main>
  );
}
