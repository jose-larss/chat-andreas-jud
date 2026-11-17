
"use client";

import { useEffect, useRef, useState } from "react";
import type { SubmitEvent } from "react";

import { X, Camera } from "lucide-react";


interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogout: () => void;
    initialData: {
        username: string;
        status: string;
        avatarUrl: string;
    };
    onSave: (status: string, image: File | null) => void | Promise<void>;
}

export const SettingsModal = ({
    isOpen,
    onClose,
    onLogout,
    initialData,
    onSave,
}: SettingsModalProps) => {
    const [activeSection, setActiveSection] = useState<"profile" | "logout">("profile");

    const [username, setUsername] = useState(initialData.username);
    const [status, setStatus] = useState(initialData.status);
    const [avatarUrl, setAvatarUrl] = useState(initialData.avatarUrl);

    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Actualizar los datos cuando se abre el modal
    useEffect(() => {
        if (isOpen) {
            setUsername(initialData.username);
            setStatus(initialData.status);
            setAvatarUrl(initialData.avatarUrl);
            setAvatarFile(null);
            setError("");
            setActiveSection("profile");
        }
    }, [isOpen, initialData]);

    // Cerrar con Escape
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    // Seleccionar avatar
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Selecciona una imagen válida");
            return;
        }

        setError("");

        setAvatarFile(file);

        const previewUrl = URL.createObjectURL(file);
        setAvatarUrl(previewUrl);
    };

    // Guardar cambios
    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError("");
        setIsSaving(true);

        try {
            await onSave(status, avatarFile);

            onClose();

        } catch (error) {
            console.error(error);
            setError("No se pudieron guardar los cambios");

        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >

            <div className="relative flex h-135 w-full max-w-185 overflow-hidden rounded-lg bg-[#313338] text-[#dbdee1] shadow-2xl">

                {/* Sidebar */}
                <aside className="flex w-45 shrink-0 flex-col bg-[#2b2d31] p-4">

                    <span className="mb-3 px-2.5 text-xs font-bold tracking-wider text-[#949ba4]">
                        SETTINGS
                    </span>

                    <button
                        type="button"
                        onClick={() => setActiveSection("profile")}
                        className={`rounded px-2.5 py-2 text-left text-sm font-medium transition ${activeSection === "profile"
                            ? "bg-[#404249] text-white"
                            : "text-[#b5bac1] hover:bg-[#35373c] hover:text-white"
                            }`}
                    >
                        Profile
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveSection("logout")}
                        className={`mt-1 rounded px-2.5 py-2 text-left text-sm font-medium transition ${activeSection === "logout"
                            ? "bg-[#404249] text-white"
                            : "text-[#b5bac1] hover:bg-[#35373c] hover:text-white"
                            }`}
                    >
                        Logout
                    </button>

                </aside>

                {/* Contenido */}

                <main className="relative min-w-0 flex-1 overflow-y-auto px-6 py-8 sm:px-10">

                    {/* Cerrar */}
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Cerrar configuración"
                        className="absolute right-5 top-5 text-[#b5bac1] transition hover:text-white"
                    >
                        <X size={21} />
                    </button>

                    {activeSection === "profile" ? (

                        /* PROFILE */
                        <form
                            onSubmit={handleSubmit}
                            className="max-w-110"
                        >

                            <h2 className="mb-7 text-xl font-bold text-white">
                                Profile
                            </h2>

                            {/* Avatar */}
                            <div className="mb-7 flex items-center gap-5">

                                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-[#b5bac1]/40 bg-[#1e1f22]">

                                    {avatarUrl ? (
                                        <img
                                            src={avatarUrl}
                                            alt="User avatar"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center">
                                            <Camera className="text-zinc-500" />
                                        </div>
                                    )}

                                </div>

                                <div>

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="rounded bg-[#4e5058] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#6d6f78]"
                                    >
                                        Change Avatar
                                    </button>

                                </div>

                            </div>

                            {/* Username */}
                            <div className="mb-5">

                                <label className="mb-2 block text-xs font-semibold text-[#b5bac1]">
                                    Username
                                </label>

                                <input
                                    disabled
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="w-full rounded bg-[#1e1f22] px-3 py-2.5 text-sm text-[#dbdee1] outline-none focus:ring-2 focus:ring-indigo-500"
                                />

                            </div>

                            {/* Status */}
                            <div className="mb-6">

                                <label className="mb-2 block text-xs font-semibold text-[#b5bac1]">
                                    Status
                                </label>

                                <textarea
                                    rows={4}
                                    maxLength={250}
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full resize-none rounded bg-[#1e1f22] p-3 text-sm text-[#dbdee1] outline-none focus:ring-2 focus:ring-indigo-500"
                                />

                                <div className="mt-1 text-right text-xs text-[#949ba4]">
                                    {status.length}/250
                                </div>

                            </div>

                            {/* Error */}
                            {error && (
                                <p className="mb-4 text-sm text-red-400">
                                    {error}
                                </p>
                            )}

                            {/* Guardar */}
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="rounded bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50"
                            >
                                {isSaving ? "Saving..." : "Save Changes"}
                            </button>

                        </form>

                    ) : (

                        /* LOGOUT */
                        <div className="flex h-full max-w-110 flex-col">

                            <h2 className="mb-7 text-xl font-bold text-white">
                                Log Out
                            </h2>

                            <div className="rounded-lg border border-[#ed4245]/30 bg-[#ed4245]/10 p-5">

                                <h3 className="mb-2 font-semibold text-white">
                                    Are you sure you want to log out?
                                </h3>

                                <p className="text-sm leading-relaxed text-[#b5bac1]">
                                    You will need to sign in again to access your account.
                                </p>

                            </div>

                            <div className="mt-auto flex justify-end gap-3 pt-6">

                                <button
                                    type="button"
                                    onClick={() => setActiveSection("profile")}
                                    className="rounded px-4 py-2.5 text-sm font-medium text-[#dbdee1] transition hover:bg-[#404249]"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={onLogout}
                                    className="rounded bg-[#da373c] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#a1282c]"
                                >
                                    Log Out
                                </button>

                            </div>

                        </div>

                    )}

                </main>


            </div>
        </div>
    );
};

export default SettingsModal;
