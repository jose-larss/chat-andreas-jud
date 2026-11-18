from django.shortcuts import get_object_or_404

from rest_framework import status

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from chat.models import Message

from chat.serializers import MessageSerializer, MessageCreateSerializer

from drf_spectacular.utils import extend_schema

@extend_schema(request=MessageCreateSerializer, responses=MessageSerializer,)



@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def message_delete(request, message_id):
    message = get_object_or_404(Message, id=message_id)

    if message.author != request.user:
        return Response(status=status.HTTP_403_FORBIDDEN)

    # 1. Guardamos el ID antes de eliminar el mensaje
    deleted_message_id = str(message.id)

    # 2. Eliminamos el mensaje
    message.delete()

    channel_layer = get_channel_layer()

    async_to_sync(channel_layer.group_send)(
        "chat",
        {
            "type": "message_deleted",
            "data": {
                "id": deleted_message_id
            },
        }
    )

    return Response({"messageId": deleted_message_id}, status=status.HTTP_200_OK)



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def message_create(request):
    serializer = MessageCreateSerializer(data=request.data)

    if serializer.is_valid():
        message = serializer.save(author=request.user)

        # 2. Serializamos el mensaje completo
        message_data = MessageSerializer(message, context={"request": request}).data

        channel_layer = get_channel_layer()

        # 4. Enviamos el evento a los usuarios conectados
        async_to_sync(channel_layer.group_send)(
            "chat",
            {
                "type": "message_created",
                "data": dict(message_data),
            }
        )
        # 5. Respondemos a la petición HTTP
        return Response(message_data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(["GET"])
@permission_classes([AllowAny])
def message_list(request):
    messages = Message.objects.all()

    serializer = MessageSerializer(messages, many=True, context={"request": request})

    return Response(serializer.data, status=status.HTTP_200_OK)
