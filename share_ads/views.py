from django.template import RequestContext

__author__ = 'cemkiy'
from django.shortcuts import render, render_to_response


def home_page(request):
    return render_to_response('home_page.html', context_instance=RequestContext(request))

def campaign_pool(request):
    return render_to_response('campaign_pool.html', context_instance=RequestContext(request))

def sorry(request):
    return render_to_response('sorry.html', context_instance=RequestContext(request))

def terms(request):
    return render_to_response('terms.html', context_instance=RequestContext(request))

def contact_us(request):
    return render_to_response('contact_us.html', context_instance=RequestContext(request))