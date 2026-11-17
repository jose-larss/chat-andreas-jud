from django.urls import path

from user.views import user_list, user_sign_up, user_me, user_login, user_logout, user_update, csrf_token

urlpatterns = [
    path("logout/", user_logout),
    path("sign-in/", user_login),
    path("sign-up/", user_sign_up),
    path("list/", user_list),
    path("me/", user_me),
    path("update/", user_update),
    path("csrf/", csrf_token, name="csrf_token"),
]