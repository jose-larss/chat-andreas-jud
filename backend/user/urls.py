from django.urls import path

from user.views import user_list, user_sign_up, user_me

urlpatterns = [
    path("sign-up/", user_sign_up),
    path("list/", user_list),
    path("me/", user_me),
]