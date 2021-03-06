from django.http import HttpResponseRedirect
from django.shortcuts import render, render_to_response
from django.template import RequestContext, Context
from django.contrib.auth.decorators import login_required
from advertiser.models import Advertiser, Campaign
from mailgun import mailgun
from payment_system.forms import money_account_form
from payment_system.models import Money_Request, Advertiser_Payment
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

                context = Context({'username': publisher.user.username, 'total_money': publisher.total_money})
                mailgun_operator = mailgun()
                mailgun_operator.send_mail_with_html('se.cemkiy@gmail.com', 'mail_give_my_money.html', context, 'share_ads:Money Request')
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

@login_required
def success(request, campaign_id):
    try:
        advertiser = Advertiser.objects.get(user=request.user)
        campaign = Campaign.objects.get(id=campaign_id)
        advertiser_payment = Advertiser_Payment.objects.get(advertiser=advertiser, campaign=campaign)
    except:
        return HttpResponseRedirect('/sorry')

    advertiser_payment.payment_status = '1'
    advertiser_payment.save()
    # campaign.active = True
    # campaign.save()

    context = Context({'username': advertiser.user.username, 'campaign': campaign.title})
    mailgun_operator = mailgun()
    mailgun_operator.send_mail_with_html('se.cemkiy@gmail.com', 'mail_success.html', context, 'share_ads:Success Payment')

    return render_to_response('success.html', locals(), context_instance=RequestContext(request))

@login_required
def cancel(request, campaign_id):
    try:
        advertiser = Advertiser.objects.get(user=request.user)
        campaign = Campaign.objects.get(id=campaign_id)
        advertiser_payment = Advertiser_Payment.objects.get(advertiser=advertiser, campaign=campaign)
    except:
        return HttpResponseRedirect('/sorry')

    advertiser_payment.payment_status = '2'
    advertiser_payment.save()
    # campaign.active = False
    # campaign.save()
    context = Context({'username': advertiser.user.username, 'campaign': campaign.title})
    mailgun_operator = mailgun()
    mailgun_operator.send_mail_with_html('se.cemkiy@gmail.com', 'mail_cancel.html', context, 'share_ads:Cancel Payment')

    return render_to_response('cancel.html', locals(), context_instance=RequestContext(request))