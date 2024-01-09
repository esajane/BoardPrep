import React, { useState, useEffect } from 'react';
import '../styles/success.scss';
import { useAppSelector } from "../redux/hooks";
import { selectUser } from "../redux/slices/authSlice";

const Success = () => {
    interface SubscriptionData {
    subscriptionID: number;
    subscription_type: string;
    start_date: string;
    end_date: string;
    user: string;
}

    const user = useAppSelector(selectUser);
    const userName = user.token.id; // Ensure this is the correct identifier for the user
      const [subscription, setSubscription] = useState<SubscriptionData | null>(null);

    useEffect(() => {
        fetchSubscriptionDetails();
    }, []);

    const fetchSubscriptionDetails = async () => {
        try {
            // Ensure the URL matches your Django route. Adjust if necessary.
            const response = await fetch(`/subscriptions/${userName}/`);
            if (response.ok) {
                const data = await response.json();
                setSubscription(data);

            } else {
                console.error('Error fetching subscription details:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching subscription details:', error);
        }
    };


     return (
        <div className='success-containerStyles'>
            <div className='success-shokoy'>
                <h2>Payment Successful!</h2>
                <div className='success-cardStyles centered-content'>
                    {subscription ? (
                        <>
                            <p>Subscription Type: {subscription.subscription_type}</p>
                            <p>Start Date: {new Date(subscription.start_date).toLocaleDateString()}</p>
                            <p>End Date: {new Date(subscription.end_date).toLocaleDateString()}</p>
                            {/* <button onClick={'http://localhost:3000/classes'}>Go to Dashboard</button> /!* Add button *!/ */}
                        </>
                    ) : (
                        <p>Loading subscription details...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Success;
