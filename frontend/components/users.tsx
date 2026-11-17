"use client";

import { useRouter } from "next/navigation";
import { Settings } from "lucide-react";

import { useState } from "react";

import { UserType } from "@/types";
import { UserPopUp } from "./user-pop-up";

import SettingsModal from "./settings-modal";


interface UsersProps {
    users: UserType[];
    currentUser: UserType | null;
    onLogout: () => Promise<void>;
    onResetUser: (state: string, avatar: File | null) => void;
}

export const Users = ({ users, currentUser, onLogout, onResetUser }: UsersProps) => {
    const router = useRouter()

    const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

    const [settingsOpen, setSettingsOpen] = useState(false)

    return (
        <aside className="relative z-20 flex w-32 shrink-0 flex-col overflow-visible bg-[#222427] p-3 md:w-36">

            <h2 className="mb-5 text-xs font-bold uppercase text-zinc-400">
                Users
            </h2>

            <div className="flex-1 space-y-4 overflow-visible">

                {users.map((user) => (
                    <div key={user.id} className="relative">

                        <button
                            type="button"
                            onClick={() => setSelectedUser(selectedUser?.id === user.id ? null : user)}
                            className="flex w-full items-center gap-2 text-left"
                        >
                            <div className="relative shrink-0">
                                <img
                                    src={user.avatar}
                                    alt={user.username}
                                    className="h-9 w-9 rounded-full object-cover"
                                />

                                <span
                                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#222427] ${user.is_online
                                        ? "bg-green-500"
                                        : "bg-zinc-500"
                                        }`}
                                />
                            </div>

                            <span className="truncate text-sm text-zinc-200">
                                {user.username}
                            </span>
                        </button>

                        {selectedUser?.id === user.id && (
                            <UserPopUp
                                user={user}
                                onClose={() => setSelectedUser(null)}
                            />
                        )}

                    </div>
                ))}

            </div>

            <div className="mt-auto flex w-full shrink-0 items-center justify-between gap-1 border-t border-zinc-700 pt-3">

                {currentUser && (
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                        <img
                            src={currentUser.avatar}
                            alt={currentUser.username}
                            className="h-8 w-8 shrink-0 rounded-full object-cover"
                        />

                        <span className="truncate text-sm text-zinc-200">
                            {currentUser.username}
                        </span>
                    </div>
                )}

                <button
                    onClick={() => setSettingsOpen(true)}
                    type="button"
                    aria-label="Settings"
                    title="Settings"
                    className="flex shrink-0 items-center justify-center rounded-md p-1.5 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                >
                    <Settings size={20} />
                </button>

            </div>

            {currentUser && (
                <SettingsModal
                    isOpen={settingsOpen}
                    onClose={() => setSettingsOpen(false)}
                    initialData={{
                        username: currentUser.username,
                        status: currentUser.status ?? "",
                        avatarUrl: currentUser.avatar ?? "",
                    }}
                    onSave={async (state: string, avatar: File | null) => {
                        //await updateProfile(state, avatar)
                        // Aquí conectaremos la API de actualización DRF.
                        onResetUser(state, avatar)
                    }}
                    onLogout={async () => {
                        await onLogout();

                        setSettingsOpen(false);

                        router.push("/login")
                    }}
                />
            )}

        </aside>
    );
};


