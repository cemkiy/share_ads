from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render, render_to_response
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from publisher.forms import user_form, new_publisher_form, edit_publisher_profile_form
from publisher.models import Publisher, Published_Adverts, Social_Data
from open_facebook.api import FacebookAuthorization, OpenFacebook

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

@login_required
def publisher_profile(request):
    try:
        publisher = Publisher.objects.get(user=request.user)
    except:
        return HttpResponseRedirect('/sorry')
    return render_to_response('publisher_profile.html', locals(), context_instance=RequestContext(request))

@login_required
def edit_publisher_profile(request):
    try:
        publisher = Publisher.objects.get(user=request.user)
    except:
        return HttpResponseRedirect('/sorry')

    form = edit_publisher_profile_form(instance=publisher)
    if request.method == 'POST':
        form = edit_publisher_profile_form(request.POST, request.FILES, instance=publisher)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect('/publisher/publisher_profile')
    return render_to_response('edit_publisher_profile.html', locals(), context_instance=RequestContext(request))

@login_required
def my_published_adverts(request):
    try:
        publisher = Publisher.objects.get(user=request.user)
        published_adverts = Published_Adverts.objects.filter(social_data__publisher=publisher)
    except:
        return HttpResponseRedirect('/sorry')
    return render_to_response('my_published_adverts.html', locals(), context_instance=RequestContext(request))

@login_required
def publisher_social_data(request):
    try:
        publisher = Publisher.objects.get(user=request.user)
        published_adverts = Published_Adverts.objects.filter(social_data__publisher=publisher)
    except:
        return HttpResponseRedirect('/sorry')
    return render_to_response('publisher_social_data.html', locals(), context_instance=RequestContext(request))

@csrf_exempt
def registered_facebook(request):
    try:
        publisher = Publisher.objects.get(user=request.user)
    except:
        return HttpResponseRedirect('/sorry')

    #control every account just one once
    if len(Social_Data.objects.filter(publisher=publisher, account_type=0)) >= 1:
        return HttpResponse(False, content_type='application/json')

    try:
        token = request.POST.get('access_token')
        long_access_token = FacebookAuthorization.extend_access_token(token)['access_token']
        print 'long is generated'
    except:
        long_access_token = token
        print long_access_token

    try:
        graph = OpenFacebook(long_access_token)
        profile = graph.get('me')
        profile_id = profile['id']
        friends = graph.get('me/friends')
        total_follower = int(friends['summary']['total_count'])
    except Exception as e:
        return HttpResponse(e)

    try:
        social_network = Social_Data(publisher=publisher, account_type=0, account_id=profile_id, account_token=long_access_token, total_follower=total_follower)
        social_network.save()
        return HttpResponse(True, content_type='application/json')
    except Exception as e:
        return HttpResponse(e, content_type='application/json')