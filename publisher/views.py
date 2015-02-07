from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.shortcuts import render, render_to_response
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from publisher.forms import user_form, new_publisher_form


def new_publisher(request):
    if request.user.is_authenticated():
        return HttpResponseRedirect('/publisher/publisher_profile/')

    form = user_form # User Table
    publisher_form = new_publisher_form # Publisher Table
    if request.method == 'POST':
        form = user_form(request.POST)
        publisher_form = new_publisher_form(request.POST)
        if form.is_valid() and publisher_form.is_valid():
            username = request.POST.get('username')
            password = request.POST.get('password')
            email = request.POST.get('email')
            first_name = request.POST.get('first_name')
            last_name = request.POST.get('last_name')
            member_user_auth = User.objects.create_user(username=username, email=email, password=password, first_name=first_name, last_name=last_name)
            # member_user_auth.is_staff = False
            # member_user_auth.is_active = False
            member_user_auth.save()

            new_publisher = publisher_form.save(commit=False)
            new_publisher.user = member_user_auth
            new_publisher.save()

            return HttpResponseRedirect('/accounts/login/')
    return render_to_response('new_publisher.html', locals(), context_instance=RequestContext(request))