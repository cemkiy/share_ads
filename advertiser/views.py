from django.http import HttpResponseRedirect
from django.shortcuts import render, render_to_response
from django.template import RequestContext
from advertiser.forms import new_advertiser_form, user_form
from django.contrib.auth.models import User

def new_advertiser(request):
    if request.user.is_authenticated():
        return HttpResponseRedirect('/member/member_profile/')

    form = user_form # User Table
    advertiser_form = new_advertiser_form # Advertiser Table
    if request.method == 'POST':
        form = user_form(request.POST)
        advertiser_form = new_advertiser_form(request.POST)
        if form.is_valid() and advertiser_form.is_valid():
            username = request.POST.get('username')
            password = request.POST.get('password')
            email = request.POST.get('email')
            first_name = request.POST.get('first_name')
            last_name = request.POST.get('last_name')
            member_user_auth = User.objects.create_user(username=username, email=email, password=password, first_name=first_name, last_name=last_name)
            # member_user_auth.is_staff = False
            # member_user_auth.is_active = False
            member_user_auth.save()

            new_advertiser = advertiser_form.save(commit=False)
            new_advertiser.user = member_user_auth
            new_advertiser.save()

            return HttpResponseRedirect('/accounts/login/')
    return render_to_response('new_advertiser.html', locals(), context_instance=RequestContext(request))
