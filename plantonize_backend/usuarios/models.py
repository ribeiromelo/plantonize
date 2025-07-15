from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

class Usuario(AbstractUser):
    TIPOS_USUARIO = [
        ('admin', 'Administrador'),
        ('colaborador', 'Colaborador'),
    ]

    tipo_usuario = models.CharField(
        max_length=20,
        choices=TIPOS_USUARIO,
        default='colaborador'
    )

    def __str__(self):
        return self.username

class Evolucao(models.Model):
    titulo = models.CharField(max_length=200)
    visualizado = models.BooleanField(default=False)
    conteudo = models.TextField()
    categoria = models.CharField(max_length=100)  # Ex: UPA, Posto, PS
    criado_por = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, related_name='criador')
    atribuido_a = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True, related_name='responsavel')
    data_criacao = models.DateTimeField(auto_now_add=True)
    data_edicao = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.titulo
    
class LogEdicao(models.Model):
    TIPOS = [
        ('criação', 'Criação'),
        ('edição', 'Edição')
    ]
    evolucao = models.ForeignKey(Evolucao, on_delete=models.CASCADE, related_name='logs')
    usuario = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True)
    tipo = models.CharField(max_length=10, choices=TIPOS)
    data = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f'{self.tipo} por {self.usuario} em {self.data.strftime("%d/%m/%Y %H:%M")}'
