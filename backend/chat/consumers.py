from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async


class ChatConsumer(AsyncJsonWebsocketConsumer):

    async def connect(self):
        self.room_name = "chat"
        self.user = self.scope["user"]

        await self.channel_layer.group_add(
            self.room_name,
            self.channel_name,
        )

        if self.user.is_authenticated:
            await self.set_online()

            await self.channel_layer.group_send(
                "chat",
                {
                    "type": "user_status",
                    "data": {
                        "id": str(self.user.id),
                        "online": True,
                    }
                }
            )

        await self.accept()


    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_name,
            self.channel_name,           
        )

        if self.user.is_authenticated:
            await self.set_offline()

            await self.channel_layer.group_send(
                "chat",
                {
                    "type": "user_status",
                    "data": {
                        "id": str(self.user.id),
                        "online": False,
                    }
                }
            )

    async def message_created(self, event):
        await self.send_json({
            "type": "message_created",
            "data": event["data"],
        })

    async def message_deleted(self, event):
        #print("MENSAJE ELIMINADO:", event)

        await self.send_json({
            "type": "message_deleted",
            "data": event["data"]["id"],
        })

    async def user_status(self, event):
        await self.send_json({
            "type": "user_status",
            "data": event["data"],
        })    


    @database_sync_to_async
    def set_online(self):
        self.user.is_online = True
        self.user.save(update_fields=["is_online"])

    @database_sync_to_async
    def set_offline(self):
        self.user.is_online = False
        self.user.save(update_fields=["is_online"])

