import uuid

from django.db import models
from django.contrib.auth.models import AbstractUser



class CustomUser(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    avatar = models.ImageField(upload_to="avatars/", null=True, blank=True)
    status = models.CharField(max_length=250, null=True, blank=True)
    is_online = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Ususario"
        verbose_name_plural = "Usuarios"

    def __str__(self):
        return self.username