from django.conf.urls import patterns, include, url
from django.conf.urls.static import static
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.contrib import admin
from share_ads import settings

admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'share_ads.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^i18n/', include('django.conf.urls.i18n')),
    url(r'^$', 'share_ads.views.home_page', name='home'),
    url(r'^advertiser/', include('advertiser.urls')),
    url(r'^publisher/', include('publisher.urls')),
    url(r'^payment_system/', include('payment_system.urls')),
    url(r'^accounts/login/$', 'django.contrib.auth.views.login',
        {'template_name': 'login.html'}),
    url(r'^accounts/logout/$', 'django.contrib.auth.views.logout',
        {'next_page': '/'}),
    url(r'^accounts/password/$', 'django.contrib.auth.views.password_change'),
    url(r'^accounts/change-password-done/$', 'django.contrib.auth.views.password_change_done'),
    url(r'', include('registration.backends.default.urls')),
    url(r'', include('django.contrib.auth.urls')),
    url(r'^user_activation/(.+)$', 'share_ads.views.user_activation'),
    url(r'^terms/$', 'share_ads.views.campaign_pool'),
    url(r'^campaign_pool/$', 'share_ads.views.campaign_pool'),
    url(r'^public_advertiser_profile/(.+)$', 'share_ads.views.public_advertiser_profile'),
    url(r'^campaign_detail/(.+)$', 'share_ads.views.campaign_detail'),
    url(r'^joined_publisher_to_a_campaign/(.+)$', 'share_ads.views.joined_publisher_to_a_campaign'),
    url(r'^contact_us/$', 'share_ads.views.contact_us'),
    url(r'^sorry/$', 'share_ads.views.sorry'),
    url(r'^forgotten_password/$', 'share_ads.views.forgotten_password'),
    url(r'^facebook/', include('django_facebook.urls')),
) + staticfiles_urlpatterns() + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
