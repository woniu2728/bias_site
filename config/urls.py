"""
URL configuration for bias-site project.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

from bias_core.api_runtime import build_api_application
from bias_core.extensions.bootstrap import get_extension_host

urlpatterns = [
    path("admin/", admin.site.urls),
]

# Build the API during startup
api = build_api_application(extension_host=get_extension_host())
urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", api.urls),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)


def rebuild_api_urlpatterns():
    """Rebuild URL patterns after extension runtime changes."""
    global urlpatterns
    api = build_api_application(extension_host=get_extension_host())
    urlpatterns = [
        path("admin/", admin.site.urls),
        path("api/", api.urls),
    ]
    if settings.DEBUG:
        urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
        urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    return urlpatterns
