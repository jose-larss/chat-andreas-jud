from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token

from rest_framework import status

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.views.decorators.csrf import ensure_csrf_cookie

from user.models import CustomUser
from user.serializers import UserSerializer, UserCreateSerializer, UserLoginSerializer, UserUpdateSerializer


from drf_spectacular.utils import extend_schema

@extend_schema(request=UserCreateSerializer, responses=UserSerializer,)



@ensure_csrf_cookie
@api_view(["GET"])
@permission_classes([AllowAny])
def csrf_token(request):
    return Response({
        "csrfToken": get_token(request)
    })



@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def user_update(request):
    serializer = UserUpdateSerializer(instance=request.user, data=request.data, partial=True, context={"request": request})

    if serializer.is_valid():
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




@api_view(["POST"])
@permission_classes([IsAuthenticated])
def user_logout(request):
    logout(request)

    return Response(status=status.HTTP_204_NO_CONTENT)




@api_view(["POST"])
@permission_classes([AllowAny])
def user_login(request):
    serializer = UserLoginSerializer(data=request.data)

    if serializer.is_valid():
        username = serializer.validated_data["username"]
        password = serializer.validated_data["password"]


        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return Response({"success": True}, status=status.HTTP_200_OK)

        return Response({"error": "credenciales invalidas"}, status=status.HTTP_400_BAD_REQUEST)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    



@api_view(["POST"])
@permission_classes([AllowAny])
def user_sign_up(request):
    serializer = UserCreateSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        # posiblemente hacer login

        return Response(serializer.data, status=status.HTTP_201_CREATED)
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
