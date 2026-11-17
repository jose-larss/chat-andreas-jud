import { Trash2 } from "lucide-react";

import { MessageType, UserType } from "@/types";

interface MessageProps {
    message: MessageType;
    onDelete: (messageId: string) => void;
    user: UserType | null
}

export const Message = ({ message, onDelete, user }: MessageProps) => {
    const date = new Date(message.created_at);

    return (
        <article className="group flex gap-3 px-5 py-2 hover:bg-zinc-800/40">

            <img
                src={message.author.avatar}
                alt={message.author.username}
                className="mt-1 h-9 w-9 shrink-0 rounded-full object-cover"
            />

            <div className="min-w-0 flex-1">

                <div className="flex flex-wrap items-center gap-2">

                    <span className="text-sm font-bold text-white">
                        {message.author.username}
                    </span>

                    <span className="text-xs text-zinc-500">
                        {date.toLocaleDateString()}{" "}
                        {date.toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit",
                        })}
                    </span>

                </div>

                {message.text && (
                    <p className="mt-1 wrap-break-word text-sm text-zinc-300">
                        {message.text}
                    </p>
                )}

                {message.image && (
                    <img
                        src={message.image}
                        alt="Imagen adjunta"
                        className="mt-2 max-h-80 max-w-full rounded-lg object-contain"
                    />
                )}

            </div>
            
            {/**este boto tiene que aparcer si el usuario que navega es el mismo que ha creado el mensaje */}
            {user && user.id === message.author.id && (
                <button
                    type="button"
                    onClick={() => onDelete(message.id)}
                    title="Eliminar mensaje"
                    aria-label="Eliminar mensaje"
                    className="h-fit rounded p-1 text-zinc-500 opacity-0 transition hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                >
                    <Trash2 size={17} />
                </button>
            )}


        </article>
    );
};
