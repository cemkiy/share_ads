from django.conf.urls import patterns, include, url
from django.contrib import admin

admin.autodiscover()

urlpatterns = patterns('advertiser.views',
    url(r'^new_advertiser/$', 'new_advertiser'),
    url(r'^new_campaign/$', 'new_campaign'),
    url(r'^advertiser_profile/$', 'advertiser_profile'),
    url(r'^edit_advertiser_profile/$', 'edit_advertiser_profile'),
    url(r'^edit_campaign_details/(.+)$', 'edit_campaign_details'),
    url(r'^my_campaigns/$', 'my_campaigns'),
                       )