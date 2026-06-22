from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from bias_core.api_runtime import build_api_application


api = build_api_application()

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", api.urls),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
