from django.urls import path

from chat.views import message_list, message_create, message_delete

urlpatterns = [
    path("list/", message_list),
    path("create/", message_create),
    path("delete/<uuid:message_id>/", message_delete),
]