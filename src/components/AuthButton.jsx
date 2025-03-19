"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton() {
  const { data: session } = useSession();

  return (
    <div className="p-3 bg-slate-800">
      <div className="container w-full mx-auto flex justify-between items-center">
        <h5 className="text-2xl font-semibold text-white">Next Auth</h5>
        {session ? (
          <button
            onClick={() => signOut()}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded cursor-pointer"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => signIn("google")}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded cursor-pointer"
          >
            Login with Google
          </button>
        )}
      </div>
    </div>
  );
}
