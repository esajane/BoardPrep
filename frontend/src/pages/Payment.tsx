import React from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Replace with your Stripe public key
const stripePromise = loadStripe('pk_test_51OKTa5IqhJdy9d5WDY3iC9qy1e0l2py5lbCmUNMq72gk4ZJEoZfMwQ8fADSq8PziXqOJJmvm1gQf8m1dGvW8aFTW00MlGGxUNi');

const cardStyles: React.CSSProperties = {
  backgroundColor: '#2c0346', // Dark purple background
  color: 'white',
  padding: '20px',
  borderRadius: '10px',
  margin: '10px',
  textAlign: 'center',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
};

const buttonStyles: React.CSSProperties = {
  backgroundColor: '#7d4e91', // Button color
  color: 'white',
  border: 'none',
  borderRadius: '20px',
  padding: '10px 20px',
  margin: '10px 0',
  cursor: 'pointer',
};

const containerStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  backgroundColor: '#100D1F', // Background color for the whole page/container
};

const userName = "joe ed Secoya"

const Payment = () => {
    const handleCheckout = async (priceId: string, planType: 'M' | 'H' | 'Y',userName: string) => {
        // Call your backend to create a checkout session
        const response = await fetch('users/joe ed secoya/create_payment_session/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
    body: JSON.stringify({ priceId, planType, userName }),
        });

        const session = await response.json();

        // Get Stripe.js instance
        const stripe = await stripePromise;

        if (stripe) {
            // Redirect to Stripe Checkout
            const result = await stripe.redirectToCheckout({
                sessionId: session.session_id,
            });

            if (result.error) {
                // Handle any errors that occur during the redirect
                console.error(result.error.message);
            }
        } else {
            console.error("Stripe couldn't be initialized.");
        }
    };

    return (
      <div style={containerStyles}>
            <h2 style={{ color: 'white' }}>Pricing plans for all subscriptions</h2>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                <div style={cardStyles}>
                    <h3>Moissanite</h3>
                    <p>The essentials to provide your best tools for learning.</p>
                    <p>₱20/month</p>
                    {/* Pass 'M' for monthly */}
                    <button style={buttonStyles} onClick={() => handleCheckout('price_1OKX1fIqhJdy9d5WdIDKTK3f', 'M',userName )}>Buy Monthly Plan</button>
                </div>
                <div style={cardStyles}>
                    <h3>Diamond</h3>
                    <p>A plan that scales with your rapidly growing learning.</p>
                    <p>₱30/month</p>
                    {/* Pass 'H' for half-yearly */}
                    <button style={buttonStyles} onClick={() => handleCheckout('price_1OKX2fIqhJdy9d5WMiBbbrMg', 'H',userName)}>Buy 6 Months Plan</button>
                </div>
                <div style={cardStyles}>
                    <h3>Topaz</h3>
                    <p>Dedicated support and boost your learning.</p>
                    <p>₱25/month</p>
                    {/* Pass 'Y' for yearly */}
                    <button style={buttonStyles} onClick={() => handleCheckout('price_1OKX3eIqhJdy9d5W1jSpjSjd', 'Y',userName)}>Buy Yearly Plan</button>
                </div>
            </div>
        </div>
    );
};

export default Payment;
