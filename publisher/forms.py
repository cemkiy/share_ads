from django import forms
from django.contrib.auth.models import User
from publisher.models import Publisher


class user_form(forms.ModelForm):
    class Meta:
        model = User
        widgets = {'password': forms.PasswordInput(),
                   'email': forms.EmailInput(),
                   'last_login': forms.HiddenInput(),
                   'is_superuser': forms.HiddenInput(),
                   'is_staff': forms.HiddenInput(),
                   'is_active': forms.HiddenInput(),
                   'date_joined': forms.HiddenInput(),
                   'groups': forms.HiddenInput(),
                   'user_permissions': forms.HiddenInput(),
                   }


class new_publisher_form(forms.ModelForm):
    class Meta:
        model = Publisher
        exclude = ['user']
        widgets = {'active': forms.HiddenInput(),
                   'publisher_profile_photo': forms.HiddenInput(),
                   }