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


class edit_publisher_profile_form(forms.ModelForm):
    class Meta:
        model = Publisher
        widgets = {'user': forms.HiddenInput(),
                   'active': forms.HiddenInput(),
                   }


class twitter_pin_form(forms.Form):
    twitter_pin = forms.CharField(max_length=50)


class send_tweet_form(forms.Form):
    tweet = forms.CharField(max_length=256, widget=forms.Textarea)


class send_fb_post_form(forms.Form):
    post_text = forms.CharField(max_length=400, widget=forms.Textarea)