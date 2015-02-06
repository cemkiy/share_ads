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

    CAMPAIGN_CHOICES = (
    (u'0', _(u'retweet')),
    (u'1', _(u'share hashtag')),
    (u'2', _(u'share campaign'))
    )

    advertiser =models.ForeignKey(Advertiser)
    title = models.CharField(max_length=40)
    category = models.ForeignKey(Category)
    campaign_type = models.CharField(max_length=1, choices=CAMPAIGN_CHOICES, default='2') #options
    total_money = models.PositiveIntegerField(default=0)
    total_joined_publisher = models.PositiveIntegerField(default=0, editable=False)
    active = models.BooleanField(default=True, editable=False)
    end_date = models.DateTimeField()
    cdate = models.DateTimeField(auto_now_add=True)

    def __unicode__(self):
        return self.title


