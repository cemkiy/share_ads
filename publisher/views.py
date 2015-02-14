from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render, render_to_response
from django.template import RequestContext, Context
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
import uuid
from advertiser.models import Campaign
from mailgun import mailgun
from share_ads.models import Activation
import twitter_try
from publisher.forms import user_form, new_publisher_form, edit_publisher_profile_form, twitter_pin_form, \
    send_tweet_form, send_fb_post_form
from publisher.models import Publisher, Published_Adverts, Social_Data
from open_facebook.api import FacebookAuthorization, OpenFacebook
from django_facebook.models import OpenGraphShare
import twitter
import webbrowser
from requests_oauthlib import OAuth1Session
from share_ads import settings


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
            member_user_auth = User.objects.create_user(username=username, email=email, password=password, first_name=first_name, last_name=last_name, is_active=False)
            # member_user_auth.is_staff = False
            # member_user_auth.is_active = False
            member_user_auth.save()

            new_publisher = publisher_form.save(commit=False)
            new_publisher.user = member_user_auth
            new_publisher.save()

            code = str(uuid.uuid4())
            activation = Activation.objects.create(activation_code=code, user=member_user_auth)
            activation.save()

            context = Context({'username': member_user_auth.username, 'email': member_user_auth.email, 'activation_code': code})
            mailgun_operator = mailgun()
            mailgun_operator.send_mail_with_html(email_to=member_user_auth.email, template_name='mail_user_activation.html', context=context, subject='Activation')

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
    except:
        return HttpResponseRedirect('/sorry')
    return render_to_response('publisher_social_data.html', locals(), context_instance=RequestContext(request))

@csrf_exempt
def registered_facebook(request):
    try:
        publisher = Publisher.objects.get(user=request.user)
    except:
        return HttpResponseRedirect('/sorry')

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
        #control every account just one once
        if len(Social_Data.objects.filter(publisher=publisher, account_type=0)) >= 1:
            social_network = Social_Data.objects.get(publisher=publisher, account_type=0)
            social_network.account_id = profile_id
            social_network.account_token = long_access_token
            social_network.total_follower = total_follower
        else:
            social_network = Social_Data(publisher=publisher, account_type=0, account_id=profile_id, account_token=long_access_token, total_follower=total_follower)
        social_network.save()
        return HttpResponse(True, content_type='application/json')
    except Exception as e:
        return HttpResponse(e, content_type='application/json')

@login_required
def registered_twitter(request, oauth_token=None, oauth_token_secret=None):
    # Victory is mine!
    # Twitter Keys
    REQUEST_TOKEN_URL = 'https://api.twitter.com/oauth/request_token'
    ACCESS_TOKEN_URL = 'https://api.twitter.com/oauth/access_token'
    AUTHORIZATION_URL = 'https://api.twitter.com/oauth/authorize'
    SIGNIN_URL = 'https://api.twitter.com/oauth/authenticate'
    consumer_key = 'zsqVde4f4vkRNopoj8zGvVM7x'
    consumer_secret = '3pcD1MNmQNyHAZrDjmNQmHdnUNfZywbA4Lbomh3ofxqzO3e6o8'
    oauth_client = OAuth1Session(consumer_key, client_secret=consumer_secret)

    try:
        publisher = Publisher.objects.get(user=request.user)
    except:
        return HttpResponseRedirect('/sorry')

    # Twitter Registered Part
    form = twitter_pin_form
    if request.method == 'POST':
        form = twitter_pin_form(request.POST)
        if form.is_valid():
            twitter_pin = request.POST.get('twitter_pin')
            oauth_client = OAuth1Session(consumer_key, client_secret=consumer_secret,
                                 resource_owner_key=oauth_token,
                                 resource_owner_secret=oauth_token_secret, verifier=twitter_pin
                                )
            try:
                resp = oauth_client.fetch_access_token(ACCESS_TOKEN_URL)
            except ValueError, e:
                print 'Invalid respond from Twitter requesting access token: %s' % e
                return HttpResponseRedirect('/sorry')
            api = twitter.Api(consumer_key=consumer_key,
                      consumer_secret=consumer_secret,
                      access_token_key=resp.get('oauth_token'),
                      access_token_secret=resp.get('oauth_token_secret'))

            if not len(Social_Data.objects.filter(publisher=publisher, account_type=1)) >= 1: # control every account just one once
                social_network = Social_Data.objects.get(publisher=publisher, account_type=1)
                social_network.account_id = resp.get('oauth_token')
                social_network.account_token = resp.get('oauth_token_secret')
                social_network.total_follower = api.VerifyCredentials().followers_count
            else:
                social_network = Social_Data(publisher=publisher, account_type=1, account_id=resp.get('oauth_token'), account_token=resp.get('oauth_token_secret'), total_follower=api.VerifyCredentials().followers_count)
            social_network.save()
            return HttpResponseRedirect('/publisher/publisher_social_data')
    elif oauth_token == None and oauth_token_secret == None:
        try:
            resp = oauth_client.fetch_request_token(REQUEST_TOKEN_URL)
        except ValueError, e:
            print 'Invalid respond from Twitter requesting temp token: %s' % e
            return HttpResponseRedirect('/sorry')
        url = oauth_client.authorization_url(AUTHORIZATION_URL)
        print url
        print resp.get('oauth_token')
        webbrowser.open(url)
        return HttpResponseRedirect('/publisher/registered_twitter/'+str(resp.get('oauth_token'))+'/'+str(resp.get('oauth_token_secret')))
    # End Twitter
    return render_to_response('registered_twitter.html', locals(), context_instance=RequestContext(request))

@login_required
def publisher_join_campaign_retweet_campaign(request, campaign_id):
    try:
        publisher = Publisher.objects.get(user=request.user)
        campaign = Campaign.objects.get(id=campaign_id)
        account = Social_Data.objects.get(publisher=publisher, account_type='1')
    except:
        return HttpResponseRedirect('/sorry')

    try:
        api = twitter.Api(consumer_key='zsqVde4f4vkRNopoj8zGvVM7x',
                      consumer_secret='3pcD1MNmQNyHAZrDjmNQmHdnUNfZywbA4Lbomh3ofxqzO3e6o8',
                      access_token_key=account.account_id,
                      access_token_secret=account.account_token)
        api.PostRetweet(original_id=campaign.campaign_data)
        published_advert = Published_Adverts(social_data=account, campaign=campaign, message_link=campaign.campaign_data)
        published_advert.save()
    except Exception as e:
        exception = e
        return HttpResponseRedirect('/sorry')

    return HttpResponseRedirect('/publisher/my_published_adverts')

@login_required
def publisher_join_campaign_share_hashtag(request, campaign_id):
    try:
        publisher = Publisher.objects.get(user=request.user)
        campaign = Campaign.objects.get(id=campaign_id)
        account = Social_Data.objects.get(publisher=publisher, account_type='1')
    except:
        return HttpResponseRedirect('/sorry')

    form = send_tweet_form
    if request.method == 'POST':
        form = send_tweet_form(request.POST)
        if form.is_valid():
            tweet = request.POST.get('tweet')
            print tweet
            try:
                api = twitter.Api(consumer_key='zsqVde4f4vkRNopoj8zGvVM7x',
                              consumer_secret='3pcD1MNmQNyHAZrDjmNQmHdnUNfZywbA4Lbomh3ofxqzO3e6o8',
                              access_token_key=account.account_id,
                              access_token_secret=account.account_token)
                api.PostUpdate(status=str(tweet)+campaign.campaign_data)
                published_advert = Published_Adverts(social_data=account, campaign=campaign, message_link=api.GetUserTimeline(count=1)[0].id)
                published_advert.save()
            except Exception as e:
                print e
                return HttpResponseRedirect('/sorry')

    return HttpResponseRedirect('/publisher/my_published_adverts')

@login_required
def publisher_join_campaign_follow_campaign(request, campaign_id):
    try:
        publisher = Publisher.objects.get(user=request.user)
        campaign = Campaign.objects.get(id=campaign_id)
        account = Social_Data.objects.get(publisher=publisher, account_type='1')
    except Exception as e:
        print e
        return HttpResponseRedirect('/sorry')

    try:
        api = twitter.Api(consumer_key='zsqVde4f4vkRNopoj8zGvVM7x',
                      consumer_secret='3pcD1MNmQNyHAZrDjmNQmHdnUNfZywbA4Lbomh3ofxqzO3e6o8',
                      access_token_key=account.account_id,
                      access_token_secret=account.account_token)
        api.CreateFriendship(screen_name=campaign.campaign_data)
        published_advert = Published_Adverts(social_data=account, campaign=campaign, message_link=api.GetUser(screen_name=campaign.campaign_data).id)
        published_advert.save()
    except Exception as e:
        print e
        return HttpResponseRedirect('/sorry')

    return HttpResponseRedirect('/publisher/my_published_adverts')

@login_required
def publisher_join_campaign_share_campaign(request, campaign_id):
    try:
        publisher = Publisher.objects.get(user=request.user)
        campaign = Campaign.objects.get(id=campaign_id)
        account = Social_Data.objects.get(publisher=publisher, account_type='0')
    except Exception as e:
        print e
        return HttpResponseRedirect('/sorry')

    form = send_fb_post_form
    if request.method == 'POST':
        form = send_fb_post_form(request.POST)
        if form.is_valid():
            post_text = request.POST.get('post_text')
            try:
                facebook = OpenFacebook(account.account_token)
                facebook.set('me/feed', message=str(post_text)+' '+str(campaign.campaign_data), url=campaign.campaign_data)
                published_advert = Published_Adverts(social_data=account, campaign=campaign, message_link=facebook.get('me/links')['data'][0]['link'])
                published_advert.save()
            except Exception as e:
                print e
                return HttpResponseRedirect('/sorry')

    return HttpResponseRedirect('/publisher/my_published_adverts')

@login_required
def publisher_join_campaign_like_campaign(request, campaign_id):
    try:
        publisher = Publisher.objects.get(user=request.user)
        campaign = Campaign.objects.get(id=campaign_id)
        account = Social_Data.objects.get(publisher=publisher, account_type='0')
    except:
        return HttpResponseRedirect('/sorry')

    try:
        facebook = OpenFacebook(account.account_token)
        last_liked_page_id = facebook.get('me/likes/')['data'][0]['id']
        advertiser_page_id = facebook.get(campaign.campaign_data+'/')['id']
        if last_liked_page_id == advertiser_page_id:
            published_advert = Published_Adverts(social_data=account, campaign=campaign, message_link=advertiser_page_id)
            published_advert.save()
        else:
            return HttpResponseRedirect('/publisher/publisher_join_campaign/' + str(campaign_id))
    except:
        return HttpResponseRedirect('/publisher/publisher_join_campaign/' + str(campaign_id))

    return HttpResponseRedirect('/publisher/my_published_adverts')

@login_required
def publisher_join_campaign(request, campaign_id):
    try:
        publisher = Publisher.objects.get(user=request.user)
        campaign = Campaign.objects.get(id=campaign_id)
    except:
        return HttpResponseRedirect('/sorry')

    if not len(Published_Adverts.objects.filter(social_data__publisher=publisher, campaign=campaign)) == 0: #Every campaign, just one once
        return HttpResponseRedirect('/publisher/my_published_adverts')

    if campaign.campaign_type in ['0', '1', '4']:
        try:
            account_tw = Social_Data.objects.get(publisher=publisher, account_type='1')
        except:
            return HttpResponseRedirect('/sorry')
        api = twitter.Api(consumer_key='zsqVde4f4vkRNopoj8zGvVM7x',
                      consumer_secret='3pcD1MNmQNyHAZrDjmNQmHdnUNfZywbA4Lbomh3ofxqzO3e6o8',
                      access_token_key=account_tw.account_id,
                      access_token_secret=account_tw.account_token)

        if campaign.campaign_type == '0':
            html_message_code = api.GetStatusOembed(id=campaign.campaign_data)['html']
        elif campaign.campaign_type == '1':
            form = send_tweet_form
        else:
            html_message_code = campaign.campaign_data
    else:
        try:
            account_fb = Social_Data.objects.get(publisher=publisher, account_type='0')
        except:
            return HttpResponseRedirect('/sorry')
        facebook = OpenFacebook(account_fb.account_token)

        if campaign.campaign_type == '2':
            form2 = send_fb_post_form
        else:
            html_message_code = campaign.campaign_data

    return render_to_response('publisher_join_campaign.html', locals(), context_instance=RequestContext(request))