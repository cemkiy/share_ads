from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import ugettext as _

class Advertiser(models.Model):
    user = models.OneToOneField(User)
    advertiser_photo = models.ImageField(null=True, blank=True, upload_to="advertiser_photo/")
    phone = models.CharField(max_length=20)
    city = models.CharField(max_length=20)
    active = models.BooleanField(default=True, editable=False)
    cdate = models.DateTimeField(auto_now_add=True)

    def __unicode__(self):
        return self.user.username


class Category(models.Model):
    category_name = models.CharField(max_length=20)

    def __unicode__(self):
        return self.category_name


class Campaign(models.Model):
    """
    campaign_data:
        retweet campaign = The numerical id of the tweet that will be retweeted
        share hashtag = twitter hashtag name
        share campaign = share url for facebook
        like campaign = facebook page name
        follow campaign = username to followed user
    """

    CAMPAIGN_CHOICES = (
    (u'0', _(u'retweet campaign')),
    (u'1', _(u'share hashtag')),
    (u'2', _(u'share campaign')),
    (u'3', _(u'like campaign')),
    (u'4', _(u'follow campaign')),
    )

    advertiser =models.ForeignKey(Advertiser)
    title = models.CharField(max_length=40)
    category = models.ForeignKey(Category)
    campaign_type = models.CharField(max_length=1, choices=CAMPAIGN_CHOICES, default='2') #options
    campaign_description = models.CharField(max_length=500, null=True)
    campaign_data = models.CharField(max_length=300, null=True)
    total_money = models.PositiveIntegerField(default=0)
    campaign_photo = models.ImageField(null=True, blank=True, upload_to="campaign_photo/")
    total_joined_publisher = models.PositiveIntegerField(default=0, editable=False)
    active = models.BooleanField(default=False, editable=False)
    end_date = models.DateTimeField()
    cdate = models.DateTimeField(auto_now_add=True)

    def __unicode__(self):
        return self.title


