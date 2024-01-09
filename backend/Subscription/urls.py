from django.urls import path
from . import views
from .views import UserViewSet, SubscriptionViewSet


urlpatterns = [
    path('stripe-webhook/', views.stripe_webhook, name='stripe-webhook'),
    path('users/<str:user_name>/',
         UserViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}),
         name='user-detail'),
    path('users/<str:user_name>/set_premium/', UserViewSet.as_view({'patch': 'set_premium'}), name='user-set-premium'),
    path('users/<str:user_name>/has_subscription/', UserViewSet.as_view({'get': 'has_subscription'}),
         name='user-has-subscription'),
    path('users/<str:user_name>/create_payment_session/', UserViewSet.as_view({'post': 'create_payment_session'}),
         name='create-payment-session'),
    # Subscription URLs
    path('subscriptions/', SubscriptionViewSet.as_view({'get': 'list', 'post': 'create'}), name='subscription-list'),
    path('subscriptions/<str:user__user_name>/', SubscriptionViewSet.as_view({'get': 'retrieve'}),
         name='subscription_detail')
]