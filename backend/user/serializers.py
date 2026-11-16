from rest_framework import serializers

from user.models import CustomUser



class UserCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = ["username", "email", "password", "status", "avatar"]
        extra_kwargs = {
            "password": {"write_only": True}
        }



class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = ["id", "username", "status", "is_online", "avatar"]