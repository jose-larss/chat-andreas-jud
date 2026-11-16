from rest_framework import serializers

from chat.models import Message

from user.serializers import UserSerializer


class MessageCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Message
        fields = ["text", "image"]



class MessageSerializer(serializers.ModelSerializer):
    author = UserSerializer(many=False, read_only=True)

    class Meta:
        model = Message
        fields = ["id", "author", "text", "image", "created_at"]