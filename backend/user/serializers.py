from rest_framework import serializers

from user.models import CustomUser



class UserLoginSerializer(serializers.Serializer):

    username = serializers.CharField()
    password = serializers.CharField(write_only=True)



class UserUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = ["id", "status", "avatar"]



class UserCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = ["username", "email", "password", "status", "avatar"]
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def create(self, validated_data):
        # 1. Extraemos la contraseña
        password = validated_data.pop("password")

        # 2. Creamos el usuario con el resto de datos
        user = CustomUser(**validated_data)

        # 3. Aplicamos el hash a la contraseña
        user.set_password(password)

        # 4. Guardamos el usuario
        user.save()

        return user



class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = ["id", "username", "status", "is_online", "avatar"]