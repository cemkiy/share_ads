import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "share_ads.settings")
from publisher.models import Published_Adverts, Social_Data
from open_facebook import OpenFacebook
import twitter


def is_message_none(publisher):
    publisher.active = False
    published_adverts_by_publisher = Published_Adverts.objects.filter(publisher=publisher)
    for published_advert in published_adverts_by_publisher:
        published_advert.active = False
        published_advert.save()

def main():
    consumer_key = 'zsqVde4f4vkRNopoj8zGvVM7x',
    consumer_secret = '3pcD1MNmQNyHAZrDjmNQmHdnUNfZywbA4Lbomh3ofxqzO3e6o8'
    published_adverts = Published_Adverts.objects.filter(active=True)
    for published_advert in published_adverts:
        if published_advert.campaign.campaign_type == '0':
            account = Social_Data.objects.get(publisher=published_advert.social_data.publisher, account_type='1')
            api = twitter.Api(consumer_key='zsqVde4f4vkRNopoj8zGvVM7x',
                      consumer_secret='3pcD1MNmQNyHAZrDjmNQmHdnUNfZywbA4Lbomh3ofxqzO3e6o8',
                      access_token_key=account.account_id,
                      access_token_secret=account.account_token)
            try:
                if api.GetRetweets(statusid=published_advert.message_link, count=1)[0].retweeted == False:
                    is_message_none(published_advert.social_data.publisher)
            except Exception as e:
                print e
        elif published_advert.campaign.campaign_type == '1':
            account = Social_Data.objects.get(publisher=published_advert.social_data.publisher, account_type='1')
            api = twitter.Api(consumer_key='zsqVde4f4vkRNopoj8zGvVM7x',
                      consumer_secret='3pcD1MNmQNyHAZrDjmNQmHdnUNfZywbA4Lbomh3ofxqzO3e6o8',
                      access_token_key=account.account_id,
                      access_token_secret=account.account_token)
            print api.GetStatus(id='565490400102985729').user.id
            try:
                if api.GetStatus(id='565490400102985729').user.id == api.VerifyCredentials().id:
                    pass
                else:
                    is_message_none(published_advert.social_data.publisher)
            except Exception as e:
                print e
        elif published_advert.campaign.campaign_type == '2':
            pass
        elif published_advert.campaign.campaign_type == '3':
            account = Social_Data.objects.get(publisher=published_advert.social_data.publisher, account_type='0')
            print account.account_token

            facebook = OpenFacebook(account.account_token)
            print facebook.get('deadspace/')['id']
            print facebook.get('me/likes/18523496657')
            if facebook.get('me/likes/' + str(published_advert.message_link))['data'] == []:
                is_message_none(published_advert.social_data.publisher)
        else:
            account = Social_Data.objects.get(publisher=published_advert.social_data.publisher, account_type='1')
            api = twitter.Api(consumer_key='zsqVde4f4vkRNopoj8zGvVM7x',
                      consumer_secret='3pcD1MNmQNyHAZrDjmNQmHdnUNfZywbA4Lbomh3ofxqzO3e6o8',
                      access_token_key=account.account_id,
                      access_token_secret=account.account_token)
            id_list = api.GetFollowerIDs(user_id=published_advert.message_link)
            try:
                if not api.VerifyCredentials().id in id_list:
                    is_message_none(published_advert.social_data.publisher)
            except Exception as e:
                print e



if __name__ == "__main__":
    main()