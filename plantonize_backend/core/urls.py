from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from usuarios.views import criar_superuser_temporario

urlpatterns = [
    path('admin/', admin.site.urls),
    path('criar-admin/', criar_superuser_temporario),  # 🔥 temporário!
    path('api/', include('usuarios.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
