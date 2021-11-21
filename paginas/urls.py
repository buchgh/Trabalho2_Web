from django.urls import path
from .views import IndexView, SangueView, EritrocitoView, MonocitoView, BasofiloView, NeutrofiloView, EosinofiloView, LinfocitoView, PlaquetaView, ReferenciaView

urlpatterns = [
    # path('endereço/', MinhaView.as_view(), name='nome-da-url),
    path('', IndexView.as_view(), name='inicio'),
    path('sangue/', SangueView.as_view(), name='sangue'),
    path('eritrocito/', EritrocitoView.as_view(), name='eritocito'),
    path('monocito/', MonocitoView.as_view(), name='monocito'),
    path('basofilo/', BasofiloView.as_view(), name='basofilo'),
    path('neutrofilo/', NeutrofiloView.as_view(), name='neutrofilo'),
    path('eosinofilo/', EosinofiloView.as_view(), name='eosinofilo'),
    path('linfocito/', LinfocitoView.as_view(), name='linfocito'),
    path('plaqueta/', PlaquetaView.as_view(), name='plaqueta'),
    path('referencia/', ReferenciaView.as_view(), name='referencias')
]
