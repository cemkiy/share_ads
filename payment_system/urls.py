from django.conf.urls import patterns, url
from django.contrib import admin

admin.autodiscover()

urlpatterns = patterns('payment_system.views',
    url(r'^give_my_money/$', 'give_my_money'),
   )