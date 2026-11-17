from django.shortcuts import get_object_or_404

from rest_framework import status

from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

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

    message.delete()

    return Response({"messageId": message_id}, status=status.HTTP_200_OK)



@api_view(["POST"])
@permission_classes([IsAuthenticated])
#@parser_classes([MultiPartParser, FormParser, JSONParser])
def message_create(request):
    serializer = MessageCreateSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(author=request.user)

        serializer_response = MessageSerializer(serializer, context={"request": request})

        return Response(serializer_response.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(["GET"])
@permission_classes([AllowAny])
def message_list(request):
    messages = Message.objects.all()

    serializer = MessageSerializer(messages, many=True, context={"request": request})

    return Response(serializer.data, status=status.HTTP_200_OK)
