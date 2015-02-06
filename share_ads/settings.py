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
    'advertiser',
    'publisher',
    'payment_system',
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
