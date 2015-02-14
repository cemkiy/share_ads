from django.db import models
from django.contrib.auth.models import User

class Activation(models.Model):
    activation_code = models.CharField(max_length=36, null=True)
    user = models.ForeignKey(User)

    def __unicode__(self):
        return self.user.username