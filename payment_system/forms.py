from django import forms
from django.contrib.auth.models import User
from publisher.models import Publisher

class money_account_form(forms.Form):
    money_account = forms.CharField(max_length=100)
