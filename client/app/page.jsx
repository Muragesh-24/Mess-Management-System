"use client";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 px-4">
      <div className="max-w-2xl w-full text-center bg-white/80 rounded-2xl shadow-2xl p-10 border border-blue-100">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-4">MessEase</h1>
        <p className="text-lg md:text-xl text-gray-700 mb-8">
          The smart way to manage your mess bookings, meals, and more.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
          <Link href="/login">
            <button className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold text-lg shadow hover:bg-blue-700 transition">Login</button>
          </Link>
          <Link href="/register">
            <button className="px-6 py-3 rounded-lg bg-white border border-blue-600 text-blue-700 font-semibold text-lg shadow hover:bg-blue-50 transition">Register</button>
          </Link>
        </div>
        <div className="mt-6 text-gray-500 text-sm">
          <span>Hall Manager? </span>
          <Link href="/login">
            <span className="text-blue-600 hover:underline">Login as Admin</span>
          </Link>
        </div>
      </div>
      <footer className="mt-10 text-gray-400 text-xs">
        &copy; {new Date().getFullYear()} MessEase. All rights reserved.
      </footer>
    </div>
  );
}