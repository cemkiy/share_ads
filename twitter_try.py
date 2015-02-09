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

import webbrowser
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
    api = twitter.Api(consumer_key=consumer_key,
                      consumer_secret=consumer_secret,
                      access_token_key='174146813-9QE1XGytq9K1wCpTalipbdctwuggkQCV1DBQxvBJ',
                      access_token_secret='JSsPeZwC3MDV5KzmafYxLhetCdyedBW5vnWLXRJ9nx0tO')
    statuses = api.GetUserTimeline(user_id='174146813', count=1)
    print statuses[0].text

def main():
    consumer_key = 'zsqVde4f4vkRNopoj8zGvVM7x'
    consumer_secret = '3pcD1MNmQNyHAZrDjmNQmHdnUNfZywbA4Lbomh3ofxqzO3e6o8'
    get_access_token(consumer_key, consumer_secret)


if __name__ == "__main__":
    main()