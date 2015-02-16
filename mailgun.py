#!/usr/bin/env python
__author__ = 'cemkiy'
# Unicode - Django
import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "kassandraproject.settings")
from django.template.loader import get_template
from django.template import RequestContext, Context
import requests


class mailgun:
    def __init__(self):
        self.key = 'key-2361ddc59bfd7a45df0acdac47b84390'
        self.sandbox = 'sandboxe1e55da3f7a7423ba6d16a58c3ffbee8.mailgun.org'
        self.recipient = 'info@shareads.com'

    def send_mail(self, email_to, text, subject):
        request_url = 'https://api.mailgun.net/v2/{0}/messages'.format(self.sandbox)
        request = requests.post(request_url, auth=('api', self.key), data={
            'from': self.recipient,
            'to': email_to,
            'subject': subject,
            'text': text
        })
        output = 'Status: {0}'.format(request.status_code) + 'Body:   {0}'.format(request.text)
        print output

    def send_mail_with_html(self, email_to, template_name, context, subject):
        html = self.render_template(template_name, context)
        request_url = 'https://api.mailgun.net/v2/{0}/messages'.format(self.sandbox)
        request = requests.post(request_url, auth=('api', self.key), data={
            'from': self.recipient,
            'to': email_to,
            'subject': subject,
            'html': html
        })
        output = 'Status: {0}'.format(request.status_code) + 'Body:   {0}'.format(request.text)
        print output

    def render_template(self, template_name, context):
        template = get_template(template_name)
        content = template.render(context)
        return content


    # def render_template(self, template_name, context):
    #     template = get_template("mail_user_activation.html")
    #
    #     content = template.render(context)
    #     return content


        # example html mail:
        # context = Context({'username': 'cemkiy'})
        # mailgun_operator = mailgun()
        # mailgun_operator.send_mail_with_html('se.cemkiy@gmail.com', 'show_username.html', context, 'show username')
        #
        # example text mail:
        # mailgun_operator = mailgun()
        # mailgun_operator.send_mail('se.cemkiy@gmail.com', 'your username cemkiy', 'show username')