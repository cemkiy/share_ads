from django.conf.urls import patterns, include, url
from django.contrib import admin

admin.autodiscover()

urlpatterns = patterns('advertiser.views',
    url(r'^new_advertiser/$', 'new_advertiser'),
                       )