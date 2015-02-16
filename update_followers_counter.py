import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "share_ads.settings")
from publisher.models import  Social_Data
from open_facebook import OpenFacebook
import twitter


def main():
    social_datas = Social_Data.objects.filter(active=True)
    for social_data in social_datas:
        if social_data.account_type == '0': #facebook
            graph = OpenFacebook(social_data.account_token)
            profile = graph.get('me')
            profile_id = profile['id']
            friends = graph.get('me/friends')
            total_follower = int(friends['summary']['total_count'])
            social_data.total_follower = total_follower
            social_data.save()
        elif social_data.account_type == '1': #twitter
            api = twitter.Api(consumer_key='zsqVde4f4vkRNopoj8zGvVM7x',
                      consumer_secret='3pcD1MNmQNyHAZrDjmNQmHdnUNfZywbA4Lbomh3ofxqzO3e6o8',
                      access_token_key=social_data.account_id,
                      access_token_secret=social_data.account_token)
            social_data.total_follower = api.VerifyCredentials().followers_count
            social_data.save()


if __name__ == "__main__":
    main()