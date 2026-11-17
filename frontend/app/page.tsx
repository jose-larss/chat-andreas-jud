"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Message } from "@/components/message";
import { MessageForm } from "@/components/message-form";
import { Users } from "@/components/users";

import { MessageType, UserType } from "@/types";

import { getMessagesList, getUserMe, getUsersList, addMessage, logout, deleteMessage, updateProfile } from "@/lib/api";


const Page = () => {
    const router = useRouter()

    const [messages, setMessages] = useState<MessageType[]>([])
    const [users, setUsers] = useState<UserType[]>([])
    const [user, setUser] = useState<UserType | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // 1. Obtener los datos iniciales
    useEffect(() => {
        const fetchData = async () => {
            try {
                const message = await getMessagesList()
                const users = await getUsersList()
                const user = await getUserMe()

                setMessages(message);
                setUsers(users);
                setUser(user);

            } catch (error) {
                console.error("Error loading chat:", error);
            }
        };

        fetchData();
    }, []);

    // 2. Hacer scroll al último mensaje
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);


    // 3. Enviar mensaje
    const handleSend = async (text: string, image: File | null) => {
       
        if (!user || (!text.trim() && !image)) return;
    
        await addMessage(text.trim(), image);

        // Recuperar los mensajes actualizados
        const updatedMessages = await getMessagesList();

        setMessages(updatedMessages);
    };

    const handleLogout = async () => {
        await logout();

        setUser(null);

        router.push("/");
    };

    const handleResetUser = async (state: string, avatar: File | null) => {
        
        try {
            const updatedUser = await updateProfile(state, avatar)

            // Actualizamos el usuario actual
            setUser((prevUser) =>
                prevUser
                    ? {
                        ...prevUser,
                        ...updatedUser,
                    }
                    : prevUser
            );
            
            // Actualizamos los mensajes del usuario actual
            setMessages((prevMessages) =>
                prevMessages.map((message) =>
                    message.author.id === user?.id
                        ? {
                            ...message,
                            author: {
                                ...message.author,
                                ...updatedUser,
                            },
                        }
                        : message
                )
            );
            // Actualizamos los usuarios del usuario actual
            setUsers((prevUsers) =>
                prevUsers.map((currentUser) =>
                    currentUser.id === updatedUser.id
                        ? {
                            ...currentUser,
                            ...updatedUser,
                        }
                        : currentUser
                )
            );

        } catch (error) {
             console.error("Error al eliminar el perfil:", error);
        }
    }

    // 4. Eliminar mensaje (actualización local provisional)
    const handleDelete = async (messageId: string) => {
        try {
            const messageDeleted = await deleteMessage(messageId);

            setMessages((prevMessages) =>
                prevMessages.filter((message) => message.id !== messageDeleted)
            );

        } catch (error) {
            console.error("Error al eliminar el mensaje:", error);
        }
    };

    return (
        <main className="flex h-screen justify-center bg-[#1e1f22] p-4 text-white">
            <div className="flex h-full w-full max-w-5xl overflow-hidden rounded-lg bg-[#292b2f]">

                <Users 
                    users={users} 
                    currentUser={user}
                    onLogout={handleLogout}  
                    onResetUser={handleResetUser}  
                />

                <section className="flex min-w-0 flex-1 flex-col">

                    <header className="border-b border-zinc-700 px-5 py-4">
                        <h1 className="font-bold"># chat</h1>
                    </header>

                    <div className="flex-1 space-y-2 overflow-y-auto py-4">

                        {messages.map((message) => (
                            <Message
                                key={message.id}
                                message={message}
                                onDelete={handleDelete}
                                user={user}
                            />
                        ))}

                        <div ref={messagesEndRef} />

                    </div>

                    <footer className="border-t border-zinc-700 p-4">
                        <MessageForm onSend={handleSend} />
                    </footer>

                </section>
            </div>
        </main>
    );
}
export default Page;
