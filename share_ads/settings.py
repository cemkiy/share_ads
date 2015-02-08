# -*- coding: utf-8 -*-
"""
Django settings for share_ads project.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.6/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.6/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'ylcl47js4(9qo77bosgkuh5j$j77$jn_&3l(r6jzc3-e_m)wa)'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

TEMPLATE_DEBUG = True

ALLOWED_HOSTS = []

#Facebook Django Open Facebook API
FACEBOOK_APP_ID = '1467336330221256'
FACEBOOK_APP_SECRET = 'c912f978e0ecf4b4e63124c6cf154254'

# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'south',
    'share_ads_main',
    'django_facebook',
    'payment_system',
    'advertiser',
    'publisher',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.locale.LocaleMiddleware',
)

TEMPLATE_CONTEXT_PROCESSORS = (
    'django.contrib.auth.context_processors.auth',
    'django.core.context_processors.debug',
    'django.core.context_processors.i18n',
    'django.core.context_processors.media',
    'django.core.context_processors.static',
    'django.core.context_processors.tz',
    'django.core.context_processors.request',
    'django.contrib.messages.context_processors.messages',
    'django_facebook.context_processors.facebook',
)

AUTHENTICATION_BACKENDS = (
    'django_facebook.auth_backends.FacebookBackend',
    'django.contrib.auth.backends.ModelBackend',
)

ROOT_URLCONF = 'share_ads.urls'

WSGI_APPLICATION = 'share_ads.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.6/ref/settings/#databases

DATABASES = {
    'default': {
          'ENGINE': 'django.db.backends.postgresql_psycopg2',
          'NAME': 'foxprojectdb',
          'USER': 'postgres',
          'PASSWORD': 'root',
          'HOST': 'localhost',
    }
}

# Internationalization
# https://docs.djangoproject.com/en/1.6/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.6/howto/static-files/

FILE_UPLOAD_PERMISSIONS = 0644

STATIC_URL = '/static/'

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, "static"),
)

# ADMIN_MEDIA_PREFIX = '/static/admin/'

MEDIA_URL = '/media/'

MEDIA_ROOT = BASE_DIR + '/media'

LANGUAGES = (
    ('tr', 'Türkçe'),
    ('en', 'English'),
)

# LOCALE_PATHS = (
#      os.path.join(BASE_DIR, 'conf'),
#      os.path.join(BASE_DIR, 'locale'),
# )

TEMPLATE_DIRS = (
    os.path.join(BASE_DIR, 'templates'),
    os.path.join(BASE_DIR, 'advertiser/templates'),
    os.path.join(BASE_DIR, 'publisher/templates'),
    os.path.join(BASE_DIR, 'share_ads/templates'),
)
