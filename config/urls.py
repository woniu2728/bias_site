"""
URL configuration for bias-site project.

Dynamically builds the API with extension routes.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from bias_core.api_runtime import build_api_application
from bias_core.extensions.bootstrap import get_extension_host


api = None
urlpatterns = []


def build_api():
    """Build the API application, integrating extension routes."""
    host = get_extension_host()
    return build_api_application(extension_host=host)


def build_urlpatterns():
    """Rebuild all URL patterns, including the extension-aware API."""
    resolved_api = build_api()
    patterns = [
        path("admin/", admin.site.urls),
        path("api/", resolved_api.urls),
    ]

    if settings.DEBUG:
        patterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
        patterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

    return resolved_api, patterns


def rebuild_api_urlpatterns():
    """Rebuild URL patterns (called after extension runtime changes)."""
    global api, urlpatterns
    api, urlpatterns = build_urlpatterns()
    return urlpatterns


rebuild_api_urlpatterns()
