from django.db import models

# Create your models here.
class Subscription(models.Model):
    SubscriptionID = models.AutoField(primary_key=True)
    TypeName = models.CharField(max_length=255, blank=False, null=False)
    Description = models.TextField(blank=True, null=True)
    Price = models.FloatField(blank=True, null=True)