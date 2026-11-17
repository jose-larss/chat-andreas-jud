
"use client";

import { UserType } from "@/types";

interface UserPopUpProps {
    user: UserType;
    onClose: () => void;
}

export const UserPopUp = ({ user, onClose }: UserPopUpProps) => {
    return (
        <div className="absolute left-full top-0 z-50 ml-2 w-52 rounded-lg border border-zinc-700 bg-[#292b2f] p-4 shadow-2xl">

            {/* Información del usuario */}
            <div className="flex flex-col gap-3">

                <img
                    src={user.avatar}
                    alt={user.username}
                    className="h-14 w-14 rounded-full object-cover"
                />

                <div>
                    <p className="font-semibold text-white">
                        {user.username}
                    </p>

                    <p className="mt-1 text-xs text-zinc-400">
                        <span className="mr-1">●</span>
                        {user.is_online ? "Online" : "Offline"}
                    </p>
                </div>

            </div>

            {/* Estado */}
            <div className="mt-4 rounded-md bg-[#222427] p-3">

                <p className="text-xs font-bold uppercase text-zinc-500">
                    Status
                </p>

                <p className="mt-2 text-xs text-zinc-300">
                    {user.status || "Sin estado"}
                </p>

            </div>

            <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full rounded bg-zinc-700 px-3 py-2 text-sm text-white hover:bg-zinc-600"
            >
                Cerrar
            </button>

        </div>
    );
};

