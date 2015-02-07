from django.conf.urls import patterns, include, url
from django.contrib import admin

admin.autodiscover()

urlpatterns = patterns('publisher.views',
                        url(r'^new_publisher/$', 'new_publisher'),
                        url(r'^publisher_profile/$', 'publisher_profile'),

                       )