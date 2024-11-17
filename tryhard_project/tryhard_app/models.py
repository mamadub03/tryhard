# Create your models here.
from django.db import models
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import AbstractUser

class CustomUser(models.Model):
    name = models.CharField(max_length=100)
    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100)  # Store hashed passwords later
    total_time = models.IntegerField(default=0)

    def save(self, *args, **kwargs):
            if self.password and not self.password.startswith('$'):  # If password is not hashed
                self.password = make_password(self.password)  # Hash the password
            super().save(*args, **kwargs)
            
    def __str__(self):
        return self.username

