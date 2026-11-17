import { MessageType } from "@/types"
import { getCsrfToken } from "./crsf"

const API = "http://localhost:8000/api"



export const getMessagesList = async (): Promise<MessageType[]> => {
    const response = await fetch(`${API}/chat/list/`)

    const data: MessageType[] =  await response.json()
    return data
}



export const addMessage = async (text: string | null, image: File | null) => {

    const csrfToken = await getCsrfToken();

    const form = new FormData()

    if (text) {form.append("text", text)}
    if (image) {form.append("image", image)}

    const response = await fetch(`${API}/chat/create/`, {
        method: "POST",
        body: form,
        credentials: "include",
        headers: {
            "X-CSRFToken": csrfToken,
        },
    })

    return response.json()
}

export const deleteMessage = async (messageId: string) => {
    
    const csrfToken = await getCsrfToken();

    const response = await fetch(`${API}/chat/delete/${messageId}/`, {
        method: "DELETE",
        credentials: "include",
        headers: {
            "X-CSRFToken": csrfToken,
        },
    })

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail || "No se pudo eliminar el mensaje");
    }

    return data.messageId
} 


export const getUsersList = async () => {
    const response = await fetch(`${API}/user/list/`)
    return response.json()
}


export const getUserMe = async () => {
    const response = await fetch(`${API}/user/me/`, {
        credentials: "include",
        cache: "no-store",
    })
    if (!response.ok) {
        return null
    }

    return response.json()
}



export const logout = async () => {
    const csrfToken = await getCsrfToken();

    const response = await fetch(`${API}/user/logout/`, {
        method: "POST",
        credentials: "include",
        headers: {
            "X-CSRFToken": csrfToken,
        },
    })

    if (!response.ok) {
        throw new Error("No se pudo cerrar la sesión");
    }

    return true;
}



export const login = async (username: string, password: string) => {

    const csrfToken = await getCsrfToken();

    const response = await fetch(`${API}/user/sign-in/`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({username, password})
    })

    const data = await response.json();

    return {
        ok: response.ok,
        data,
    };
}


export const signUp = async (username: string, email: string, password: string, status: string, avatar: File | null) => {
   
    const csrfToken = await getCsrfToken();

    const form = new FormData()

    form.append("username", username)
    form.append("email", email)
    form.append("password", password)
    form.append("status", status)
    
    if (avatar) {form.append("avatar", avatar)}

    const response = await fetch(`${API}/user/sign-up/`, {
        method: "POST",
        credentials: "include",
        body: form,
        headers: {
            "X-CSRFToken": csrfToken,
        }
    })

    const data = await response.json();

    return {
        ok: response.ok,
        data,
    };
}



export const updateProfile = async (status: string, avatar: File | null) => {
    const csrfToken = await getCsrfToken();

    const form = new FormData();

    form.append("status", status);

    if (avatar) {
        form.append("avatar", avatar);
    }

    const response = await fetch(`${API}/user/update/`, {
        method: "PATCH",
        credentials: "include",
        body: form,
        headers: {
            "X-CSRFToken": csrfToken,
        }
    })

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail || "No se pudo actualizar el perfil");
    }
    
    return data
}
