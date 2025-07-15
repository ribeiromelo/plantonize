from django.urls import path
from .views import RegistroUsuarioView
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegistroUsuarioView, EvolucaoViewSet
from .views import ListaUsuariosView
from .views import UsuarioLogadoView


router = DefaultRouter()
router.register(r'evolucoes', EvolucaoViewSet, basename='evolucoes')

urlpatterns = [
    path('register/', RegistroUsuarioView.as_view(), name='registro'),
    path('', include(router.urls)),
    path('usuarios/', ListaUsuariosView.as_view(), name='lista-usuarios'),
    path('usuario/', UsuarioLogadoView.as_view(), name='usuario-logado'),
]
