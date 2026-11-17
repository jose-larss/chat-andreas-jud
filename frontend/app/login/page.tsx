"use client";

import { useState, } from "react";
import type { SubmitEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { login } from "@/lib/api";

const LoginPage = () => {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError("");
        setIsLoading(true);

        try {
            const response = await login(username, password);

            if (!response.ok) {
                setError("Usuario o contraseña incorrectos");
                return;
            }

            router.push("/");

        } catch (error) {
            console.error(error);
            setError("Error al iniciar sesión");

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#1e1f22] p-4 text-white">

            <div className="w-full max-w-sm rounded-lg bg-[#292b2f] p-6 shadow-xl">

                <h1 className="mb-6 text-xl font-bold">
                    Login
                </h1>

                <form onSubmit={handleSubmit} className="space-y-3">

                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        required
                        autoComplete="username"
                        className="w-full rounded-md bg-[#1e1f22] px-3 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:ring-2 focus:ring-indigo-500"
                    />

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        autoComplete="current-password"
                        className="w-full rounded-md bg-[#1e1f22] px-3 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:ring-2 focus:ring-indigo-500"
                    />

                    {error && (
                        <p className="text-sm text-red-400">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-md bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </button>

                </form>

                <p className="mt-5 text-center text-xs text-zinc-400">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/signup"
                        className="text-indigo-400 hover:text-indigo-300"
                    >
                        Sign up
                    </Link>
                </p>

            </div>
        </main>
    );
}
export default LoginPage;
