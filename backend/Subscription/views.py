from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import UserSerializer, SubscriptionSerializer, UserSubscriptionSerializer
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
import stripe
from django.http import HttpResponse
from .models import Subscription
from datetime import datetime
from User.models import User
from django.shortcuts import redirect
from django.utils.crypto import get_random_string
import time

from django.conf import settings
stripe.api_key = settings.STRIPE_SECRET_KEY

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSubscriptionSerializer
    lookup_field = 'user_name'
    @action(detail=True, methods=['post'])
    def create_payment_session(self, request, user_name=None):
        user_name = request.data.get('userName')
        price_id = request.data.get('priceId')
        plan_type = request.data.get('planType')

        valid_price_ids = ['price_1OKX1fIqhJdy9d5WdIDKTK3f', 'price_1OKX2fIqhJdy9d5WMiBbbrMg',
                           'price_1OKX3eIqhJdy9d5W1jSpjSjd']
        if price_id not in valid_price_ids:
            return Response({'error': 'Invalid price ID'}, status=status.HTTP_400_BAD_REQUEST)

        success_token = get_random_string(32)
        request.session['payment_success_token'] = success_token

        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{'price': price_id, 'quantity': 1}],
            mode='subscription',
            metadata={
                'user_name': user_name,
                'plan_type': plan_type,
            },
            client_reference_id=user_name,
            success_url=request.build_absolute_uri(
                f'http://localhost:3000/success'
            ),
            cancel_url=request.build_absolute_uri('http://localhost:3000/payment')
        )
        return Response({'session_id': session.id})

    @action(detail=True, methods=['patch'])
    def set_premium(self, request, user_name=None):
        user = User.objects.get(user_name=user_name)
        user.is_premium = request.data.get('is_premium', user.is_premium)
        user.save()
        return Response({'status': 'premium status updated'})

    @action(detail=True, methods=['get'])
    def has_subscription(self, request, user_name=None):
        user = User.objects.get(user_name=user_name)
        serializer = self.get_serializer(user)
        return Response(serializer.data)


@csrf_exempt
@require_POST
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META['HTTP_STRIPE_SIGNATURE']
    endpoint_secret = 'whsec_f35732ecffbf816f2e3f8b3167fc5bb0b9104f1d27af2383c8400adea10423e0'
    event = None

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError:
        return JsonResponse({'status': 'invalid payload'}, status=400)
    except stripe.error.SignatureVerificationError:
        return JsonResponse({'status': 'invalid signature'}, status=400)

    if event['type'] == 'checkout.session.completed':
        print('yawa ka')
        session = event['data']['object']
        user_name = session.get('client_reference_id')
        print(user_name)
        # Retrieve the line item from the session
        line_items = stripe.checkout.Session.list_line_items(session.id, limit=1)
        if line_items and line_items.data:
            # Assuming the first line item represents the subscription
            line_item = line_items.data[0]
            price_id = line_item.price.id  # Or use `amount_total` to get the total amount

            # Determine the subscription type based on the price ID or amount
            if price_id == 'price_1OKX1fIqhJdy9d5WdIDKTK3f':  # Replace with your actual price ID for 'M'
                subscription_type = 'M'
            elif price_id == 'price_1OKX2fIqhJdy9d5WMiBbbrMg':  # Replace with your actual price ID for 'H'
                subscription_type = 'H'
            elif price_id == 'price_1OKX3eIqhJdy9d5W1jSpjSjd':  # Replace with your actual price ID for 'Y'
                subscription_type = 'Y'
            else:
                return JsonResponse({'status': 'unknown subscription type'}, status=400)

            user = User.objects.get(user_name=user_name)

            Subscription.objects.create(
                user=user,
                subscription_type=subscription_type,
                start_date=datetime.today().date()
            )

            if not user.is_premium:
                user.is_premium = True
                user.save()

        return JsonResponse({'status': 'success'})

    return JsonResponse({'status': 'unhandled event type'}, status=400)




def subscription_success(request):
    # Retrieve the token from the query parameters
    plan_type = request.GET.get('planType')
    session_id = request.GET.get('session_id')
    success_token = request.GET.get('token')

    session = stripe.checkout.Session.retrieve(session_id)
    user_name = session.metadata.get('user_name')

    try:
        user = User.objects.get(user_name=user_name)
    except User.DoesNotExist:
        return HttpResponse("User not found.", status=404)

    # Validate the success token against what's stored in the session
    session_success_token = request.session.get('payment_success_token')
    if not session_success_token or session_success_token != success_token:
        return HttpResponse("Invalid token or session expired.", status=400)

    # Clear the success token from the session
    del request.session['payment_success_token']

    subscription = Subscription.objects.create(
        user=user,
        subscription_type=plan_type,
        start_date=datetime.today().date(),
        # Calculate the end_date based on plan_type
    )
    user.is_premium = True
    user.save()

    return HttpResponse("Subscription successful!", status=200)



class SubscriptionViewSet(viewsets.ModelViewSet):
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer
    lookup_field = 'user__user_name'  # Adjust this based on your actual field names

    def get_queryset(self):
        """
        Optionally restricts the returned subscriptions to a given user,
        by filtering against a `user_name` query parameter in the URL.
        """
        queryset = Subscription.objects.all()
        user_name = self.kwargs.get('user__user_name')  # Retrieve the username from URL kwargs
        if user_name is not None:
            queryset = queryset.filter(user__user_name=user_name)
        return queryset


