export const createChatSocket = (onMessage: (data: any) => void) => {
    const socket = new WebSocket("ws://localhost:8000/ws/chat/")
    /*
    socket.onopen = () => {
        console.log("WEBSOCKET CONECTADO");
    }

    socket.onclose = (event) => {
        console.log("WEBSOCKET DESCONECTADO", {
            code: event.code,
            reason: event.reason,
            wasClean: event.wasClean
        });
    }

    socket.onerror = (error) => {
        console.log("WEBSOCKET ERROR", error);
    }
    */
    socket.onmessage = (event) => {
        const data = JSON.parse(event.data)

        onMessage(data)
    }
    return socket
}