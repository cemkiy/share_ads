from django.db import models
from django.contrib.auth.models import User
from advertiser.models import Campaign


class Publisher(models.Model):
    user = models.OneToOneField(User)
    publisher_profile_photo = models.ImageField(null=True, blank=True, upload_to="profile_photos/")
    birthday = models.DateField(null=True, blank=True)
    phone = models.CharField(max_length=20)
    city = models.CharField(max_length=20)
    total_money = models.PositiveIntegerField(default=0, editable=False)
    active = models.BooleanField(default=True, editable=False)
    cdate = models.DateTimeField(auto_now_add=True)

    def __unicode__(self):
        return self.user.username

class Social_Data(models.Model):

    ACCOUNT_CHOICES = (
    (u'0', u'facebook'),
    (u'1', u'twitter'),
    (u'2', u'instagram')
    )

    publisher = models.ForeignKey(Publisher)
    account_type = models.CharField(max_length=1, choices=ACCOUNT_CHOICES, default='0') #options
    account_id = models.CharField(max_length=300)
    account_token = models.CharField(max_length=300)
    total_follower = models.PositiveIntegerField(default=0)
    active = models.BooleanField(default=True, editable=False)
    cdate = models.DateTimeField(auto_now_add=True)

    def __unicode__(self):
        return self.publisher.user.username


class Published_Adverts(models.Model):
    social_data = models.ForeignKey(Social_Data)
    campaign = models.ForeignKey(Campaign)
    message_link = models.CharField(max_length=150)
    active = models.BooleanField(default=True, editable=False)
    cdate = models.DateTimeField(auto_now_add=True)

    def __unicode__(self):
        return self.social_data.publisher.user.username
