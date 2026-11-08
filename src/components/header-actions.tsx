"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import type { Category } from "@/lib/api";

interface HeaderActionsProps {
  categories: Category[];
  user: { name: string; email: string; image?: string | null } | null;
  authUnavailable: boolean;
}

export function HeaderActions({
  categories,
  user,
  authUnavailable,
}: HeaderActionsProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  async function signOut() {
    try {
      const result = await authClient.signOut();
      if (result.error) {
        toast.error(result.error.message || "সাইন আউট করা যায়নি।");
        return;
      }
      toast.success("সাইন আউট সম্পন্ন হয়েছে।");
      setMenuOpen(false);
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "সাইন আউট করা যায়নি।",
      );
    }
  }

  return (
    <>
      <div className="header-account">
        {authUnavailable && (
          <span className="auth-connection-error" role="status">
            অ্যাকাউন্ট সংযোগে সমস্যা
          </span>
        )}
        {user ? (
          <div className="account-menu-wrap">
            <button
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              className="account-trigger"
              onClick={() => setMenuOpen((open) => !open)}
              type="button"
            >
              <span className="avatar avatar-small">
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img alt="" src={user.image} />
                ) : (
                  user.name.slice(0, 1)
                )}
              </span>
              <span>{user.name.split(" ")[0]}</span>
              <span aria-hidden="true">⌄</span>
            </button>
            {menuOpen && (
              <div className="user-menu" role="menu">
                <div className="user-menu-title">
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  role="menuitem"
                >
                  আমার প্রোফাইল
                </Link>
                <button onClick={signOut} role="menuitem" type="button">
                  ↩ সাইন আউট
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link className="button button-ghost" href="/signin">
              সাইন ইন
            </Link>
            <Link className="button button-primary button-small" href="/signup">
              সাইন আপ
            </Link>
          </>
        )}
      </div>
      <details className="mobile-navigation">
        <summary aria-label="মেনু খুলুন">
          <span />
          <span />
          <span />
        </summary>
        <nav aria-label="মোবাইল ক্যাটাগরি" className="mobile-navigation-panel">
          {categories.map((category) => (
            <Link href={`/category/${category.slug}`} key={category.slug}>
              <span>{category.icon}</span>
              {category.nameBn}
            </Link>
          ))}
          {user ? (
            <>
              <Link href="/profile">আমার প্রোফাইল</Link>
              <button onClick={signOut} type="button">
                সাইন আউট
              </button>
            </>
          ) : (
            <>
              <Link href="/signin">সাইন ইন</Link>
              <Link href="/signup">সাইন আপ</Link>
            </>
          )}
        </nav>
      </details>
    </>
  );
}
