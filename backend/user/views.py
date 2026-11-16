from rest_framework import status

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from user.models import CustomUser
from user.serializers import UserSerializer, UserCreateSerializer


from drf_spectacular.utils import extend_schema

@extend_schema(request=UserCreateSerializer, responses=UserSerializer,)



@api_view(["POST"])
@permission_classes([AllowAny])
def user_sign_up(request):
    serializer = UserCreateSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()

        response_serializer = UserSerializer(serializer, context={"request": request})

        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_me(request):
    user = request.user

    serializer = UserSerializer(user, context={"request": request})

    return Response(serializer.data, status=status.HTTP_200_OK)



@api_view(["GET"])
@permission_classes([AllowAny])
def user_list(request):

    users = CustomUser.objects.all()

    serializer = UserSerializer(users, many=True, context={"request": request})

    return Response(serializer.data, status=status.HTTP_200_OK)
