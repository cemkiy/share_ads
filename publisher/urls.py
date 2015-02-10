from django.conf.urls import patterns, url
from django.contrib import admin

admin.autodiscover()

urlpatterns = patterns('publisher.views',
    url(r'^new_publisher/$', 'new_publisher'),
    url(r'^publisher_profile/$', 'publisher_profile'),
    url(r'^edit_publisher_profile/$', 'edit_publisher_profile'),
    url(r'^edit_publisher_profile/$', 'edit_publisher_profile'),
    url(r'^my_published_adverts/$', 'my_published_adverts'),
    url(r'^publisher_social_data/$', 'publisher_social_data'),
    url(r'^registered_facebook/$', 'registered_facebook'),
    url(r'^registered_twitter/$', 'registered_twitter'),
    url(r'^registered_twitter/(?P<oauth_token>.+?)/(?P<oauth_token_secret>.+?)$', 'registered_twitter'),
    url(r'^publisher_join_campaign_retweet/(.+)$', 'publisher_join_campaign_retweet'),
   )