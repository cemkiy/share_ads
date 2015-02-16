from django.http import HttpResponseRedirect
from django.shortcuts import render, render_to_response
from django.template import RequestContext, Context
from django.contrib.auth.decorators import login_required
import uuid
from advertiser.forms import new_advertiser_form, user_form, new_campaign_form, edit_advertiser_profile_form, \
    edit_campaign_details_form
from django.contrib.auth.models import User
from advertiser.models import Advertiser, Campaign
from mailgun import mailgun
from payment_system.models import Advertiser_Payment
from share_ads.models import Activation


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
            member_user_auth.is_active = False
            member_user_auth.save()

            new_advertiser = advertiser_form.save(commit=False)
            new_advertiser.user = member_user_auth
            new_advertiser.save()

            code = str(uuid.uuid4())
            activation = Activation.objects.create(activation_code=code, user=member_user_auth)
            activation.save()

            context = Context({'username': member_user_auth.username, 'email': member_user_auth.email, 'activation_code': code})
            mailgun_operator = mailgun()
            mailgun_operator.send_mail_with_html(email_to=member_user_auth.email, template_name='mail_user_activation.html', context=context, subject='Activation')

            return HttpResponseRedirect('/accounts/login/')
    return render_to_response('new_advertiser.html', locals(), context_instance=RequestContext(request))

@login_required
def new_campaign(request):
    try:
        advertiser = Advertiser.objects.get(user=request.user)
    except:
        return HttpResponseRedirect('/sorry')

    form = new_campaign_form(initial={'advertiser': advertiser, 'active': False})
    if request.method == 'POST':
        form = new_campaign_form(request.POST, request.FILES)
        if form.is_valid():
            create_campaign = form.save()
            advertiser_payment = Advertiser_Payment(advertiser=advertiser, payment_status='0', campaign=create_campaign)
            advertiser_payment.save()
            return HttpResponseRedirect('/payment_system/advertiser_payment/' + str(create_campaign.id))

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

@login_required
def my_campaigns(request):
    try:
        advertiser = Advertiser.objects.get(user=request.user)
        campaigns = Campaign.objects.filter(advertiser=advertiser).order_by('-cdate')
    except:
        return HttpResponseRedirect('/sorry')
    return render_to_response('my_campaigns.html', locals(), context_instance=RequestContext(request))