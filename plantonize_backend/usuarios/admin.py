from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario

class UsuarioAdmin(UserAdmin):
    model = Usuario
    list_display = ['username', 'email', 'tipo_usuario', 'is_staff']
    fieldsets = UserAdmin.fieldsets + (
        ('Função no sistema', {'fields': ('tipo_usuario',)}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Função no sistema', {'fields': ('tipo_usuario',)}),
    )

admin.site.register(Usuario, UsuarioAdmin)
