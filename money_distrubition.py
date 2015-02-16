import os
from django.utils.timezone import now

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "share_ads.settings")
from publisher.models import Published_Adverts, Publisher
from advertiser.models import Campaign
from datetime import date, datetime


def main():
    campaigns = Campaign.objects.filter(active=True)
    for campaign in campaigns:
        if campaign.end_date.day == date.today().day and campaign.end_date.month == date.today().month and campaign.end_date.year == date.today().year:
            print campaign.title
            published_adverts_to_campaign = Published_Adverts.objects.filter(campaign=campaign, active=True)
            total_published_counter = 0
            for published_advert in published_adverts_to_campaign:
                total_published_counter += published_advert.social_data.total_follower
            money_for_the_per_to_person = (campaign.total_money - (campaign.total_money * 1/10)) / total_published_counter
            print money_for_the_per_to_person
            for published_advert in published_adverts_to_campaign:
                try:
                    publisher = Publisher.objects.get(active=True, id=published_advert.social_data.publisher.id)
                    publisher.total_money += (published_advert.social_data.total_follower * money_for_the_per_to_person)
                    publisher.save()
                except Exception as e:
                    print e
            campaign.active = False
            campaign.save()


if __name__ == "__main__":
    main()