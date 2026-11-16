import uuid

from django.db import models

from user.models import CustomUser

class Message(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    text = models.TextField(null=True, blank=True)
    image = models.ImageField(upload_to="messages/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Mensaje"
        verbose_name_plural = "Mensajes"

    def __str__(self):
        return self.author.email