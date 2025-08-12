import Link from "next/link";
import { ReactNode } from "react";

export function Sidebar({ children }: { children: ReactNode }) {
  return (
    <div
      id="hs-pro-sidebar"
      className="hs-overlay [--auto-close:md] hs-overlay-open:translate-x-0 -translate-x-full fl36v ufjzp h587a qaks0 hs-overlay-minified:w-13 overflow-hidden hidden fixed rm8lf uxfxy gihcw aqyoh c1j8w lnk45 dark:border-neutral-700 md:block mme0s md:end-auto pfr33 dark:bg-neutral-800"
      role="dialog"
      tabIndex={-1}
      aria-label="Sidebar"
    >
      <div className="relative flex flex-col h1r77 a0p67">{children}</div>
    </div>
  );
}

export function SidebarHeader() {
  return (
    <header className="gdxvw fglch flex ox2cl items-center n9hej p-4">
      <div className="-ms-2 flex items-center n6i5x">
        <Link
          href="/"
          className="inline-flex jkwm1 items-center pb094 mp30q inline-block cnneu d05xb focus:outline-hidden r17tr"
        >
          <span className="text-xl font-bold">Logo</span>
        </Link>
      </div>
    </header>
  );
}

export function SidebarNav() {
  return (
    <ul className="flex flex-col j7q7t px-2">
      <li>
        <Link
          href="#"
          className="group relative w-full flex items-center v1hon od5va sfv8v w4xo0 c9jt8 pb094 r17bf focus:outline-hidden lkleg dark:hover:bg-neutral-700/50 dark:focus:bg-neutral-700/50 dark:text-neutral-200"
        >
          New chat
        </Link>
      </li>
      <li>
        <Link
          href="#"
          className="group w-full flex items-center v1hon od5va sfv8v w4xo0 c9jt8 truncate pb094 r17bf focus:outline-hidden lkleg dark:hover:bg-neutral-700/50 dark:focus:bg-neutral-700/50 dark:text-neutral-200"
        >
          Search chats
        </Link>
      </li>
      <li>
        <Link
          href="#"
          className="group relative w-full flex items-center v1hon od5va sfv8v w4xo0 c9jt8 pb094 r17bf focus:outline-hidden lkleg dark:hover:bg-neutral-700/50 dark:focus:bg-neutral-700/50 dark:text-neutral-200"
        >
          Explore
        </Link>
      </li>
      <li>
        <Link
          href="#"
          className="group relative w-full flex items-center v1hon od5va sfv8v w4xo0 c9jt8 pb094 r17bf focus:outline-hidden lkleg dark:hover:bg-neutral-700/50 dark:focus:bg-neutral-700/50 dark:text-neutral-200"
        >
          Chat details
        </Link>
      </li>
    </ul>
  );
}

export function SidebarRecent() {
  return (
    <div className="hs-overlay-minified:opacity-0 sd513 ufjzp q1glq jxswk fp3m4 flex flex-col fr7c6 overflow-y-auto xwpzv y0qzi bxgd5 n3xnc dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
      <div className="flex flex-col">
        <span className="block zw1wr wyf4w w4xo0 rr36x dark:text-neutral-500">
          Recent chats
        </span>
        <ul className="flex flex-col j7q7t">
          <li>
            <Link
              href="#"
              className="w-full flex items-center n9hej s53ws zw1wr ep58o w4xo0 c9jt8 truncate pb094 r17bf focus:outline-hidden lkleg dark:hover:bg-neutral-700/50 dark:focus:bg-neutral-700/50 dark:text-neutral-200"
            >
              Example Chat
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export function SidebarModalTrigger() {
  return (
    <div className="p-4">
      <button className="w-full rounded bg-blue-600 px-4 py-2 text-white dark:bg-blue-500">
        New Chat
      </button>
    </div>
  );
}
