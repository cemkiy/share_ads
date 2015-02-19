from django import forms

class contact_us_form(forms.Form):
    subject = forms.CharField(max_length=250)
    name = forms.CharField(max_length=250)
    email = forms.CharField(max_length=250)
    message = forms.CharField(max_length=500)