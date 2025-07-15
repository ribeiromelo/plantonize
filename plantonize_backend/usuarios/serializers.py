from rest_framework import serializers
from .models import Usuario, Evolucao, LogEdicao
from django.contrib.auth.password_validation import validate_password

class RegistroUsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    
    class Meta:
        model = Usuario
        fields = ('username', 'password', 'tipo_usuario')

    def create(self, validated_data):
        user = Usuario.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            tipo_usuario=validated_data.get('tipo_usuario', 'colaborador')
        )
        return user

class LogEdicaoSerializer(serializers.ModelSerializer):
    usuario = serializers.StringRelatedField()

    class Meta:
        model = LogEdicao
        fields = ['id', 'tipo', 'usuario', 'data']

class EvolucaoSerializer(serializers.ModelSerializer):
    logs = LogEdicaoSerializer(many=True, read_only=True)

    class Meta:
        model = Evolucao
        fields = '__all__'
        read_only_fields = ['criado_por', 'data_criacao', 'data_edicao']

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'tipo_usuario']
