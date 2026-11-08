import Link from "next/link";
import Image from "next/image";
import { getCategories } from "@/lib/api";
import { getSession } from "@/lib/session";
import { HeaderActions } from "@/components/header-actions";
import { CategoryNavigation } from "@/components/category-navigation";

function getBengaliDate() {
  return new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(new Date());
}

export async function SiteHeader() {
  const [categoriesResult, sessionResult] = await Promise.allSettled([
    getCategories(),
    getSession(),
  ]);
  const categories =
    categoriesResult.status === "fulfilled" ? categoriesResult.value : [];
  const user =
    sessionResult.status === "fulfilled" && sessionResult.value
      ? {
          name: sessionResult.value.user.name,
          email: sessionResult.value.user.email,
          image: sessionResult.value.user.image,
        }
      : null;
  const authUnavailable = sessionResult.status === "rejected";

  return (
    <header className="site-header">
      <div className="header-top">
        <div className="header-top-inner content-width">
          <Link aria-label="বাজার দর - হোম" className="brand" href="/">
            <span aria-hidden="true" className="brand-icon">
              <Image alt="" height={18} src="/logo-icon.png" width={18} />
            </span>
            <span className="brand-copy">
              <strong>বাজার দর</strong>
              <span>{getBengaliDate()}</span>
            </span>
          </Link>
          <div className="header-spacer" />
          <HeaderActions
            authUnavailable={authUnavailable}
            categories={categories}
            user={user}
          />
        </div>
      </div>
      <div className="category-nav">
        <CategoryNavigation categories={categories} />
        <div className="category-nav-error">
          {categoriesResult.status === "rejected" && (
            <span className="nav-error" role="status">ক্যাটাগরি লোড করা যায়নি।</span>
          )}
        </div>
      </div>
    </header>
  );
}
