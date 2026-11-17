"use client";

import { useRef, useState } from "react";
import type { SubmitEvent } from "react";


interface MessageFormProps {
    onSend: (text: string, 
    image: File | null) => Promise<void>;
}

export const MessageForm = ({ onSend }: MessageFormProps) => {
    const [text, setText] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [isSending, setIsSending] = useState(false);

    const fileRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!text.trim() && !image) return;

        try {
            setIsSending(true);
            
            await onSend(text, image);

            setText("");
            setImage(null);

            if (fileRef.current) {
                fileRef.current.value = "";
            }

        } catch (error) {
            console.error("Error sending message:", error);

        } finally {
            setIsSending(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex items-center gap-3 rounded-lg bg-[#303236] px-4 py-3"
        >
            <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="text-2xl text-zinc-400 hover:text-white"
            >
                +
            </button>

            <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                    setImage(e.target.files?.[0] ?? null);
                }}
            />

            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Message #chat"
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-400"
            />

            {image && (
                <span className="max-w-28 truncate text-xs text-zinc-400">
                    {image.name}
                </span>
            )}

            <button
                type="submit"
                disabled={isSending || (!text.trim() && !image)}
                className="text-sm font-semibold text-blue-400 disabled:opacity-40"
            >
                {isSending ? "Enviando..." : "Enviar"}
            </button>
        </form>
    );
};
