from django.shortcuts import render
from rest_framework import generics, viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from .models import Usuario, Evolucao, LogEdicao
from .serializers import (
    RegistroUsuarioSerializer,
    UsuarioSerializer,
    EvolucaoSerializer,
    LogEdicaoSerializer,
)

# --------------------------------------------
# Registro de novo usuário (colaborador)
# --------------------------------------------

class RegistroUsuarioView(generics.CreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = RegistroUsuarioSerializer

# --------------------------------------------
# ViewSet de Evoluções
# --------------------------------------------

class EvolucaoViewSet(viewsets.ModelViewSet):
    serializer_class = EvolucaoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Evolucao.objects.all()

        # Colaborador vê apenas suas evoluções
        if user.tipo_usuario == 'colaborador':
            return queryset.filter(atribuido_a=user)

        # Admin pode aplicar filtro por colaborador
        colaborador_id = self.request.query_params.get('colaborador')
        if user.tipo_usuario == 'admin' and colaborador_id:
            return queryset.filter(atribuido_a__id=colaborador_id)

        return queryset

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()

        # Marca como visualizado se for colaborador e ainda não tiver sido visto
        if (
            request.user.tipo_usuario == 'colaborador'
            and instance.atribuido_a == request.user
            and not instance.visualizado
        ):
            instance.visualizado = True
            instance.save(update_fields=['visualizado'])

        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def perform_create(self, serializer):
        evolucao = serializer.save(criado_por=self.request.user)
        LogEdicao.objects.create(
            evolucao=evolucao,
            usuario=self.request.user,
            tipo='criação'
        )

    def perform_update(self, serializer):
        evolucao = serializer.save()
        LogEdicao.objects.create(
            evolucao=evolucao,
            usuario=self.request.user,
            tipo='edição'
        )

    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def logs(self, request, pk=None):
        evolucao = self.get_object()
        logs = evolucao.logs.all()
        serializer = LogEdicaoSerializer(logs, many=True)
        return Response(serializer.data)
    serializer_class = EvolucaoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Evolucao.objects.all()

        # Colaborador vê apenas o que foi atribuído a ele
        if user.tipo_usuario == 'colaborador':
            return queryset.filter(atribuido_a=user)

        # Admin pode filtrar por interno
        colaborador_id = self.request.query_params.get('colaborador')
        if user.tipo_usuario == 'admin' and colaborador_id:
            return queryset.filter(atribuido_a__id=colaborador_id)

        return queryset
    

    def perform_create(self, serializer):
        evolucao = serializer.save(criado_por=self.request.user)
        LogEdicao.objects.create(
            evolucao=evolucao,
            usuario=self.request.user,
            tipo='criação'
        )

    def perform_update(self, serializer):
        evolucao = serializer.save()
        LogEdicao.objects.create(
            evolucao=evolucao,
            usuario=self.request.user,
            tipo='edição'
        )

    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def logs(self, request, pk=None):
        evolucao = self.get_object()
        logs = evolucao.logs.all()
        serializer = LogEdicaoSerializer(logs, many=True)
        return Response(serializer.data)

# --------------------------------------------
# Listagem de todos os usuários (admin)
# --------------------------------------------

class ListaUsuariosView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        usuarios = Usuario.objects.all()
        serializer = UsuarioSerializer(usuarios, many=True)
        return Response(serializer.data)

# --------------------------------------------
# Dados do usuário logado
# --------------------------------------------

class UsuarioLogadoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UsuarioSerializer(request.user)
        return Response(serializer.data)
