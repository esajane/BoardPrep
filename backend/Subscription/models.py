from django.db import models
from django.utils import timezone
from datetime import timedelta

# Assuming User model is in the same app, otherwise adjust the import

class Subscription(models.Model):
    SUBSCRIPTION_TYPES = [
        ('M', 'Monthly'),
        ('H', 'Half-Yearly'),
        ('Y', 'Yearly'),
    ]
    subscriptionID = models.AutoField(primary_key=True)
    user = models.ForeignKey('User.User', on_delete=models.CASCADE, related_name='subscriptions',default=None)
    subscription_type = models.CharField(max_length=1, choices=SUBSCRIPTION_TYPES,default=None)
    start_date = models.DateField(default=None)
    end_date = models.DateField(default=None)

    @property
    def is_active(self):
        # Checks if the current date is within the subscription period
        return self.start_date <= timezone.now().date() <= self.end_date

    def save(self, *args, **kwargs):
        # Automatically set the end date based on the subscription type
        if not self.subscriptionID:  # only set end_date if it's a new object
            if self.subscription_type == 'M':
                self.end_date = self.start_date + timedelta(days=30)
            elif self.subscription_type == 'H':
                self.end_date = self.start_date + timedelta(days=182)  # Approx half year
            elif self.subscription_type == 'Y':
                self.end_date = self.start_date + timedelta(days=365)

        # Update user's premium status based on subscription
        # Assuming 'is_premium' is a field in the User model
        if self.is_active and not self.user.is_premium:
            self.user.is_premium = True
            self.user.save()

        super(Subscription, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.user_name}'s {self.get_subscription_type_display()} Subscription from {self.start_date} to {self.end_date}"
