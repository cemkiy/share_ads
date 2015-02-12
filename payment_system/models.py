from django.db import models
from django.utils.translation import ugettext as _
from advertiser.models import Advertiser, Campaign
from publisher.models import Publisher


class Money_Request(models.Model):
    publisher = models.ForeignKey(Publisher)
    total_money = models.PositiveIntegerField(default=0, editable=False)
    money_account = models.CharField(max_length=100)
    active = models.BooleanField(default=True, editable=False)
    cdate = models.DateTimeField(auto_now_add=True)

    def __unicode__(self):
        return self.publisher.user.username


class Advertiser_Payment(models.Model):
    PAYMENT_CHOICES = (
    (u'0', _(u'waiting_payment')),
    (u'1', _(u'success_payment')),
    (u'2', _(u'cancel_payment')),
    (u'4', _(u'wrong_payment')),
    )

    advertiser = models.ForeignKey(Advertiser)
    payment_status = models.CharField(max_length=1, choices=PAYMENT_CHOICES, default='0') #options
    campaign = models.ForeignKey(Campaign)
    active = models.BooleanField(default=True, editable=False)
    cdate = models.DateTimeField(auto_now_add=True)