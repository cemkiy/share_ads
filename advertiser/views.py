from django.http import HttpResponseRedirect
from django.shortcuts import render, render_to_response
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from advertiser.forms import new_advertiser_form, user_form, new_campaign_form, edit_advertiser_profile_form, \
    edit_campaign_details_form
from django.contrib.auth.models import User
from advertiser.models import Advertiser, Campaign


def new_advertiser(request):
    if request.user.is_authenticated():
        return HttpResponseRedirect('/advertiser/advertiser_profile/')

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

@login_required
def new_campaign(request):
    try:
        advertiser = Advertiser.objects.get(user=request.user)
    except:
        return HttpResponseRedirect('/sorry')

    form = new_campaign_form(initial={'advertiser': advertiser})
    if request.method == 'POST':
        form = new_campaign_form(request.POST)
        advertiser_form = new_advertiser_form(request.POST)
        if form.is_valid():
            form.save()

            return HttpResponseRedirect('/campaign_pool')
    return render_to_response('new_campaign.html', locals(), context_instance=RequestContext(request))

@login_required
def edit_campaign_details(request, campaign_id):
    try:
        advertiser = Advertiser.objects.get(user=request.user)
        campaign = Campaign.objects.get(id=campaign_id, advertiser=advertiser)
    except:
        return HttpResponseRedirect('/sorry')

    form = edit_campaign_details_form(instance=campaign)
    if request.method == 'POST':
        form = edit_campaign_details_form(request.POST, instance=campaign)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect('/campaign_detail/' + str(campaign.id))
    return render_to_response('edit_campaign_details.html', locals(), context_instance=RequestContext(request))

@login_required
def advertiser_profile(request):
    try:
        advertiser = Advertiser.objects.get(user=request.user)
    except:
        return HttpResponseRedirect('/sorry')
    return render_to_response('advertiser_profile.html', locals(), context_instance=RequestContext(request))

@login_required
def edit_advertiser_profile(request):
    try:
        advertiser = Advertiser.objects.get(user=request.user)
    except:
        return HttpResponseRedirect('/sorry')

    form = edit_advertiser_profile_form(instance=advertiser)
    if request.method == 'POST':
        form = edit_advertiser_profile_form(request.POST, request.FILES, instance=advertiser)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect('/advertiser/advertiser_profile')
    return render_to_response('edit_advertiser_profile.html', locals(), context_instance=RequestContext(request))

