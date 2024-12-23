# Create your models here.
from django.db import models
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
class CustomUser(models.Model):
    name = models.CharField(max_length=100)
    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100)  # Store hashed passwords later
    total_time = models.IntegerField(default=0)

    
    def save(self, *args, **kwargs):

        # Check if the user already exists (i.e., has a primary key)

        if self.pk:

            # Fetch the original password from the database

            original = CustomUser.objects.get(pk=self.pk)

            if self.password != original.password:

                # Password has changed; hash it

                self.password = make_password(self.password)

        else:

            # New user; hash the password

            self.password = make_password(self.password)

        super().save(*args, **kwargs)
            
    def __str__(self):
        return self.username

