from django import forms
from django.contrib.auth.models import User
from advertiser.models import Advertiser, Campaign
from django.forms.extras.widgets import SelectDateWidget

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


class new_advertiser_form(forms.ModelForm):
    class Meta:
        model = Advertiser
        exclude = ['user']
        widgets = {'active': forms.HiddenInput(),
                   'advertiser_photo': forms.HiddenInput(),
                   }


class new_campaign_form(forms.ModelForm):
    class Meta:
        model = Campaign
        widgets = {'advertiser': forms.HiddenInput(),
                   }


class edit_advertiser_profile_form(forms.ModelForm):
    class Meta:
        model = Advertiser
        widgets = {'user': forms.HiddenInput(),
                   'active': forms.HiddenInput(),
                   }


class edit_campaign_details_form(forms.ModelForm):
    class Meta:
        model = Campaign
        widgets = {'advertiser': forms.HiddenInput(),
                   'campaign_type': forms.HiddenInput(),
                   }