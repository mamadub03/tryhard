from django.contrib import admin
from .models import CustomUser


class CustomUserAdmin(admin.ModelAdmin):
    model = CustomUser
    list_display = ['username', 'name', 'total_time']  # Add total_time to list_display
    search_fields = ['username', 'name']

    # Specify fields for the form (this includes 'total_time')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Info', {'fields': ('name', 'total_time')}),
    )

admin.site.register(CustomUser, CustomUserAdmin)
