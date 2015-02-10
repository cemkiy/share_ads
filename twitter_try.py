#!/usr/bin/env python
#
# Copyright 2007-2013 The Python-Twitter Developers
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "share_ads.settings")
import webbrowser
from open_facebook import OpenFacebook
from requests_oauthlib import OAuth1Session

import twitter
from share_ads import settings

REQUEST_TOKEN_URL = 'https://api.twitter.com/oauth/request_token'
ACCESS_TOKEN_URL = 'https://api.twitter.com/oauth/access_token'
AUTHORIZATION_URL = 'https://api.twitter.com/oauth/authorize'
SIGNIN_URL = 'https://api.twitter.com/oauth/authenticate'
consumer_key = 'zsqVde4f4vkRNopoj8zGvVM7x',
consumer_secret = '3pcD1MNmQNyHAZrDjmNQmHdnUNfZywbA4Lbomh3ofxqzO3e6o8'


def get_access_token(consumer_key, consumer_secret):
    # api = twitter.Api(consumer_key=consumer_key,
    # consumer_secret = consumer_secret,
    # access_token_key = '174146813-9QE1XGytq9K1wCpTalipbdctwuggkQCV1DBQxvBJ',
    # access_token_secret = 'JSsPeZwC3MDV5KzmafYxLhetCdyedBW5vnWLXRJ9nx0tO')

    # api.PostRetweet(original_id='564851441932972033')
    # print api.GetRetweets(statusid='552795737999024128', count=1)[0]
    # print api.GetStatusOembed(id='552795737999024128')['html']
    # print api.GetUserTimeline(count=1)[0].id
    # print api.GetUser(screen_name='mememetali').id

    token = 'CAAU2iNy6lsgBABngv6cPzdkbloZBCqdD5ubXqj3T8MSfvZA5MtCVmHbf9ESBPr5DGCwcTogviqMsIppaJW4eFhI0JJZBZAHCK1kDRokC8BuoZC92q2FQrVXX7ZAYiKNiDCcKqZCZCzBOVfcHpiHCpQS1OhL8PoEo2MWubsZBLQmHeuH69hEJxp6uCTdgape1vXkINhVCzO87B12ZBrmmcC0dns'


    facebook = OpenFacebook(token)
    print facebook.get('me/likes/')['data'][0]['id']


def main():
    consumer_key = 'zsqVde4f4vkRNopoj8zGvVM7x'
    consumer_secret = '3pcD1MNmQNyHAZrDjmNQmHdnUNfZywbA4Lbomh3ofxqzO3e6o8'
    get_access_token(consumer_key, consumer_secret)


if __name__ == "__main__":
    main()