from django.contrib.auth.models import User
from django.http import HttpResponseRedirect
from django.template import RequestContext
from advertiser.models import Campaign, Advertiser
from publisher.models import Published_Adverts
from share_ads.models import Activation

__author__ = 'cemkiy'
from django.shortcuts import render, render_to_response


def home_page(request):
    return render_to_response('home_page.html', context_instance=RequestContext(request))

def campaign_pool(request):
    try:
        campaigns = Campaign.objects.filter(active=True).order_by('-cdate')
    except:
        return HttpResponseRedirect('/sorry')
    return render_to_response('campaign_pool.html', locals(), context_instance=RequestContext(request))

def campaign_detail(request, campaign_id):
    try:
        campaign = Campaign.objects.get(id=campaign_id, active=True)
    except:
        return HttpResponseRedirect('/sorry')
    return render_to_response('campaign_detail.html', locals(), context_instance=RequestContext(request))

def public_advertiser_profile(request, advertiser_id):
    try:
        advertiser = Advertiser.objects.get(id=advertiser_id)
    except:
        return HttpResponseRedirect('/sorry')
    return render_to_response('public_advertiser_profile.html', locals(), context_instance=RequestContext(request))

def sorry(request):
    return render_to_response('sorry.html', context_instance=RequestContext(request))

def terms(request):
    return render_to_response('terms.html', context_instance=RequestContext(request))

def contact_us(request):
    return render_to_response('contact_us.html', context_instance=RequestContext(request))

def joined_publisher_to_a_campaign(request, campaign_id):
    try:
        published_adverts = Published_Adverts.objects.filter(campaign__id=campaign_id, active=True).order_by('-cdate')
    except:
        return HttpResponseRedirect('/sorry')

    return render_to_response('campaign_pool.html', locals(), context_instance=RequestContext(request))

def user_activation(request, identity):
    try:
        active = Activation.objects.get(activivation_code=identity)
        user = User.objects.get(id=active.user.id)
    except:
        return HttpResponseRedirect('/sorry')
    try:
        if user:
            user.is_active = True
            user.save()
            active.delete()
            return HttpResponseRedirect('/accounts/login/')
    except:
        return HttpResponseRedirect('/sorry')