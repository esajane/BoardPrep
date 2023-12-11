from rest_framework import serializers
from User.models import User
from Subscription.models import Subscription

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = '__all__'

class UserSubscriptionSerializer(serializers.ModelSerializer):
    has_subscription = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = '__all__'

    def get_has_subscription(self, obj):
        return Subscription.objects.filter(user=obj).exists()