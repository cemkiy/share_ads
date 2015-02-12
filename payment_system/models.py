from django.db import models

# Create your models here.
from publisher.models import Publisher


class Money_Request(models.Model):
    publisher = models.ForeignKey(Publisher)
    total_money = models.PositiveIntegerField(default=0, editable=False)
    money_account = models.CharField(max_length=100)
    active = models.BooleanField(default=True, editable=False)
    cdate = models.DateTimeField(auto_now_add=True)

    def __unicode__(self):
        return self.publisher.user.username