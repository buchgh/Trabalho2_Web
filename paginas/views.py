from django.views.generic import TemplateView


# Create your views here.
class IndexView(TemplateView):
    template_name = "index.html"


class SangueView(TemplateView):
    template_name = "tecidosanguineo.html"

class EritrocitoView(TemplateView):
    template_name = "eritrocitos.html"

class MonocitoView(TemplateView):
    template_name = "monocitos.html"

class BasofiloView(TemplateView):
    template_name = "basofilos.html"


class NeutrofiloView(TemplateView):
    template_name = "neutrofilos.html"


class EosinofiloView(TemplateView):
    template_name = "eosinofilos.html"


class LinfocitoView(TemplateView):
    template_name = "linfocitos.html"


class PlaquetaView(TemplateView):
    template_name = "plaqueta.html"


class ReferenciaView(TemplateView):
    template_name = "referencias.html"