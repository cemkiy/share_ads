from django.contrib import admin
from django.db.models import get_models, get_app

# Register your models here.

for model in get_models(get_app('advertiser')):
    admin.site.register(model)

for model in get_models(get_app('publisher')):
    admin.site.register(model)

for model in get_models(get_app('share_ads')):
    admin.site.register(model)