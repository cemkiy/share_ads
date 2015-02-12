from django.http import HttpResponseRedirect
from django.shortcuts import render, render_to_response
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from advertiser.models import Advertiser, Campaign
from payment_system.forms import money_account_form
from payment_system.models import Money_Request
from publisher.models import Publisher

@login_required
def give_my_money(request):
    try:
        publisher = Publisher.objects.get(user=request.user)
    except:
        return HttpResponseRedirect('/sorry')

    form = money_account_form
    information = 'Money limit is 15'
    if publisher.total_money >= 15: # Send Money limit
        if request.method == 'POST':
            form = money_account_form(request.POST)
            if form.is_valid():
                money_account = request.POST.get('money_account')
                money_request = Money_Request(publisher=publisher, total_money=publisher.total_money, money_account=money_account)
                money_request.save()
                information = 'We will pay your money asap ;) '
                #TODO Mail send admins
    else:
        information = "Your money is under the limit"

    return render_to_response('give_my_money.html', locals(), context_instance=RequestContext(request))

@login_required
def advertiser_payment(request, campaign_id):
    try:
        advertiser = Advertiser.objects.get(user=request.user)
        campaign = Campaign.objects.get(id=campaign_id)
    except:
        return HttpResponseRedirect('/sorry')



    return render_to_response('advertiser_payment.html', locals(), context_instance=RequestContext(request))

