"use client";

import {
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
} from "@clerk/nextjs";

export default function AuthControls() {
  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row">
      <Show when="signed-out">
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <SignInButton>
            <button className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800">
              Sign in
            </button>
          </SignInButton>
          <SignUpButton>
            <button className="rounded-full border border-black px-6 py-3 text-sm font-semibold transition hover:bg-black/5">
              Sign up
            </button>
          </SignUpButton>
        </div>
      </Show>
      <Show when="signed-in">
        <UserButton />
      </Show>
    </div>
  );
}
