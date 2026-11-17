"use client";

import { useRef, useState } from "react";
import type { SubmitEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { signUp } from "@/lib/api";

const SignupPage = () => {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState("");
    const [avatar, setAvatar] = useState<File | null>(null);

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const fileRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError("");
        setIsLoading(true);

        try {
            const response = await signUp(
                username,
                email,
                password,
                status,
                avatar
            );

            if (!response.ok) {
                setError(
                    response.data?.detail ||
                    "No se pudo crear la cuenta"
                );
                return;
            }

            router.push("/login");

        } catch (error) {
            console.error(error);
            setError("Error al registrar el usuario");

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#1e1f22] p-4 text-white">

            <div className="w-full max-w-sm rounded-lg bg-[#292b2f] p-6 shadow-xl">

                <h1 className="mb-6 text-xl font-bold">
                    Sign up
                </h1>

                <form onSubmit={handleSubmit} className="space-y-3">

                    {/* Username */}
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        required
                        autoComplete="username"
                        className="w-full rounded-md bg-[#1e1f22] px-3 py-3 text-sm outline-none placeholder:text-zinc-500 focus:ring-2 focus:ring-indigo-500"
                    />

                    {/* Email */}
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                        autoComplete="email"
                        className="w-full rounded-md bg-[#1e1f22] px-3 py-3 text-sm outline-none placeholder:text-zinc-500 focus:ring-2 focus:ring-indigo-500"
                    />

                    {/* Password */}
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        autoComplete="new-password"
                        className="w-full rounded-md bg-[#1e1f22] px-3 py-3 text-sm outline-none placeholder:text-zinc-500 focus:ring-2 focus:ring-indigo-500"
                    />

                    {/* Status */}
                    <textarea
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        placeholder="Status"
                        rows={2}
                        className="w-full resize-none rounded-md bg-[#1e1f22] px-3 py-3 text-sm outline-none placeholder:text-zinc-500 focus:ring-2 focus:ring-indigo-500"
                    />

                    {/* Avatar */}
                    <div className="space-y-2">

                        <label className="text-xs font-medium text-zinc-400">
                            Avatar
                        </label>

                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                setAvatar(e.target.files?.[0] ?? null);
                            }}
                            className="w-full text-xs text-zinc-400 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-700 file:px-3 file:py-2 file:text-white hover:file:bg-zinc-600"
                        />

                        {avatar && (
                            <p className="truncate text-xs text-zinc-400">
                                {avatar.name}
                            </p>
                        )}

                    </div>

                    {/* Error */}
                    {error && (
                        <p className="text-sm text-red-400">
                            {error}
                        </p>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-md bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
                    >
                        {isLoading ? "Creating account..." : "Sign up"}
                    </button>

                </form>

                <p className="mt-5 text-center text-xs text-zinc-400">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="text-indigo-400 hover:text-indigo-300"
                    >
                        Login
                    </Link>
                </p>

            </div>
        </main>
    );
}
export default SignupPage;