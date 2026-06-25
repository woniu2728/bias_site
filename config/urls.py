"""
URL configuration for bias-site project.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from bias_core.api_runtime import build_api_application


class LazyMount:
    def __init__(self, prefix, router, tags=None):
        self.prefix = prefix
        self.router = router
        self.tags = tags or []


class ExtensionRouter:
    def __init__(self):
        self._mounts = None

    def make(self, key):
        if key == "routes":
            return self
        raise AttributeError(key)

    def get_mounts(self):
        if self._mounts is None:
            self._mounts = self._discover()
        return self._mounts

    def _discover(self):
        import importlib.metadata
        mounts = []
        for ep in importlib.metadata.entry_points(group="bias.extensions"):
            name = ep.name
            for sub in [("api", "/" + name), ("admin_api", "/admin")]:
                try:
                    mod = importlib.import_module("bias_ext_%s.backend.%s" % (name, sub[0]))
                    router = getattr(mod, "router", None)
                    if router is not None:
                        mounts.append(LazyMount(sub[1], router, [name.title()]))
                except Exception:
                    pass
        return mounts


api = build_api_application(extension_host=ExtensionRouter())

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", api.urls),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)


def rebuild_api_urlpatterns():
    global api, urlpatterns
    api = build_api_application(extension_host=ExtensionRouter())
    urlpatterns = [
        path("admin/", admin.site.urls),
        path("api/", api.urls),
    ]
    if settings.DEBUG:
        urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
        urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    return urlpatterns