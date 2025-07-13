// GoogleCalendarSuccess.js
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const GoogleCalendarSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Extract access token from URL
        const urlParams = new URLSearchParams(location.search);
        const accessToken = urlParams.get('access_token');
        const tokenType = urlParams.get('token_type');
        const expiresIn = urlParams.get('expires_in');
        const scope = urlParams.get('scope');

        if (!accessToken) {
          throw new Error('No access token received');
        }

        console.log('Received access token:', accessToken ? 'Yes' : 'No');
        console.log('Token type:', tokenType);
        console.log('Expires in:', expiresIn);
        console.log('Scope:', scope);

        // Fetch calendar events immediately using the token
        await fetchCalendarEvents(accessToken);

      } catch (err) {
        console.error('Google Calendar callback error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    const fetchCalendarEvents = async (token) => {
      try {
        // Try different possible API endpoints
        const possibleEndpoints = [
          '/api/google/events',
          'http://localhost:5000/api/google/events',
          'http://localhost:3001/api/google/events',
          'http://localhost:8000/api/google/events'
        ];

        let lastError = null;
        
        for (const endpoint of possibleEndpoints) {
          try {
            console.log(`Trying endpoint: ${endpoint}`);
            
            const response = await fetch(endpoint, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });

            console.log(`${endpoint} - Status:`, response.status);
            console.log(`${endpoint} - Content-Type:`, response.headers.get('content-type'));
            
            // Get the actual response text first
            const responseText = await response.text();
            console.log(`${endpoint} - Response preview:`, responseText.substring(0, 200));
            
            // Check if response is actually JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
              console.warn(`${endpoint} returned non-JSON response`);
              continue; // Try next endpoint
            }

            if (!response.ok) {
              const errorData = JSON.parse(responseText);
              throw new Error(`API Error: ${response.status} - ${errorData.message || 'Unknown error'}`);
            }

            const eventsData = JSON.parse(responseText);
            console.log('Events received:', eventsData);
            
            setEvents(eventsData);
            setLoading(false);
            setShowCalendar(true);
            return; // Success! Exit the function
            
          } catch (err) {
            console.error(`Failed to fetch from ${endpoint}:`, err);
            lastError = err;
            continue; // Try next endpoint
          }
        }
        
        // If we get here, all endpoints failed
        throw new Error(`All API endpoints failed. Last error: ${lastError?.message || 'Unknown error'}`);
        
      } catch (err) {
        console.error('Error fetching calendar events:', err);
        setError(`Failed to load calendar events: ${err.message}`);
        setLoading(false);
      }
    };

    handleCallback();
  }, [location]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Connecting to Google Calendar...</p>
          <p className="mt-2 text-sm text-gray-500">Loading your events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Connection Failed</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-x-2">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showCalendar) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Success Header */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <div className="flex items-center">
              <div className="text-green-500 text-4xl mr-4">✅</div>
              <div>
                <h2 className="text-2xl font-bold text-green-800 mb-1">Successfully Connected!</h2>
                <p className="text-green-600">Your Google Calendar has been connected to Workflow-Pro.</p>
              </div>
            </div>
          </div>

          {/* Calendar Events */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">📅 Your Upcoming Events</h2>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
              >
                Go to Dashboard
              </button>
            </div>

            {events.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-4">📭</div>
                <p className="text-gray-600">No upcoming events found</p>
                <p className="text-sm text-gray-500 mt-2">Your calendar events will appear here once you have some scheduled.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((event, index) => (
                  <div
                    key={event.id || index}
                    className="border-l-4 border-blue-500 pl-4 py-3 bg-gray-50 rounded-r-md hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">
                          {event.summary || 'No Title'}
                        </h3>
                        
                        <div className="text-sm text-gray-600 mb-2">
                          {event.start?.dateTime ? (
                            <span>
                              🗓️ {formatDate(event.start.dateTime)} at {formatTime(event.start.dateTime)}
                              {event.end?.dateTime && (
                                <span> - {formatTime(event.end.dateTime)}</span>
                              )}
                            </span>
                          ) : event.start?.date ? (
                            <span>🗓️ {formatDate(event.start.date)} (All day)</span>
                          ) : (
                            <span>🗓️ No date specified</span>
                          )}
                        </div>

                        {event.location && (
                          <div className="text-sm text-gray-600 mb-2">
                            📍 {event.location}
                          </div>
                        )}

                        {event.description && (
                          <div className="text-sm text-gray-600 line-clamp-2">
                            {event.description}
                          </div>
                        )}
                      </div>

                      {event.htmlLink && (
                        <a
                          href={event.htmlLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm ml-4 whitespace-nowrap"
                        >
                          View in Google
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium"
            >
              Continue to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default GoogleCalendarSuccess;