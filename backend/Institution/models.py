from django.db import models

# Create your models here.
class Institution(models.Model):
    InstitutionID = models.AutoField(primary_key=True)
    InstitutionName = models.CharField(max_length=255, blank=False, null=False)
    Address = models.CharField(max_length=255, blank=True, null=True)
    ContactNumber = models.CharField(max_length=50, blank=True, null=True)
    Subscription = models.ForeignKey('Subscription.Subscription', on_delete=models.SET_NULL, blank=True, null=True, related_name='Institutions')

