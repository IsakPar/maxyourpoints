subscribe 
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Welcome to Max Your Points!</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
      <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Max Your Points! ✈️</h1>
    </div>

    <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0;">
      <p style="font-style: italic; text-align: center; color: #4a5568;">🛬 You've landed safely in our inbox lounge – tray tables up, it's time to maximize your travel!</p>

      <h2 style="color: #0f766e; margin-top: 0;">Thanks for subscribing!</h2>

      <p>We're excited to have you join our community of savvy travelers and points enthusiasts.</p>

      <p>Here's what you can expect from us:</p>
      <ul style="color: #4a5568;">
        <li>🎯 <strong>Expert travel hacking tips</strong> - Maximize your points and miles</li>
        <li>✈️ <strong>Airline and aviation insights</strong> - Stay ahead of the game</li>
        <li>🏨 <strong>Hotel reviews and deals</strong> - Best value accommodations</li>
        <li>💳 <strong>Credit card recommendations</strong> - Earn more, spend less</li>
      </ul>

      <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #14b8a6;">
        <p style="margin: 0; font-weight: bold; color: #0f766e;">Pro Tip:</p>
        <p style="margin: 5px 0 0 0;">Check out our latest articles on maximizing airline miles - you could save hundreds on your next trip!</p>
      </div>

      <p>Happy travels,<br>
      <strong>The Max Your Points Team</strong></p>
    </div>

    <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #718096;">
      <p>You're receiving this because you subscribed to Max Your Points newsletter.</p>
      <p><a href="{{unsubscribe_url}}" style="color: #718096;">Unsubscribe</a> | <a href="https://maxyourpoints.com" style="color: #718096;">Visit our website</a></p>
    </div>
  </body>
</html>




unsubsribe 

for this one lets make sure that the feedback is sent in an email to feedback@maxyourpoints.com

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Unsubscribed - Max Your Points</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f9fafb; }
        .container { max-width: 600px; margin: 50px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px 20px; text-align: center; }
        .header h1 { color: white; font-size: 32px; margin-bottom: 10px; }
        .header p { color: rgba(255,255,255,0.9); font-size: 18px; }
        .content { padding: 40px 30px; text-align: center; }
        .sad-emoji { font-size: 64px; margin-bottom: 20px; }
        .departure-message { font-style: italic; color: #6b7280; margin-bottom: 20px; font-size: 16px; }
        .message { font-size: 18px; color: #374151; margin-bottom: 30px; }
        .feedback-section { background: #f9fafb; border-radius: 12px; padding: 30px; margin: 30px 0; }
        .feedback-section h3 { color: #374151; margin-bottom: 20px; }
        .feedback-reasons { text-align: left; }
        .feedback-reasons label { display: block; margin-bottom: 15px; color: #4b5563; cursor: pointer; }
        .feedback-reasons input { margin-right: 10px; }
        .submit-button {
            margin-top: 20px;
            background: #10b981;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            font-weight: bold;
            cursor: pointer;
        }
        .resubscribe-section { background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-radius: 12px; padding: 30px; margin: 30px 0; }
        .resubscribe-section h3 { color: #065f46; margin-bottom: 15px; }
        .resubscribe-button { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; margin-top: 15px; }
        .footer { background: #1f2937; color: white; padding: 25px 20px; text-align: center; }
        .social-links a { color: #10b981; text-decoration: none; margin: 0 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>You're all set 👋</h1>
            <p>We’ve taken you off our list – no more emails from us (for now!)</p>
        </div>

        <div class="content">
            <div class="sad-emoji">😢</div>

            <p class="departure-message">
                ✈️ Looks like you've taken off without us – we hope your new destination has better travel hacks (but we doubt it).
            </p>

            <div class="message">
                <strong>{{subscriber_email}}</strong> has been successfully unsubscribed from Max Your Points.<br><br>
                It’s been a pleasure having you on board. Should you ever crave tier points and upgrade secrets again, we’ll be right here.
            </div>

            <div class="feedback-section">
                <h3>📝 Quick feedback?</h3>
                <p style="color: #6b7280; margin-bottom: 20px;">Why did you unsubscribe?</p>
                <form class="feedback-reasons" onsubmit="return false;">
                    <label><input type="checkbox" name="reason" value="Too many emails"> Too many emails</label>
                    <label><input type="checkbox" name="reason" value="Not relevant"> Content wasn’t relevant</label>
                    <label><input type="checkbox" name="reason" value="Better alternatives"> Found a better points guide</label>
                    <label><input type="checkbox" name="reason" value="Not traveling"> Not traveling much</label>
                    <label><input type="checkbox" name="reason" value="Break"> Just needed a break</label>
                    <button type="submit" class="submit-button">Send Feedback</button>
                </form>
            </div>

            <div class="resubscribe-section">
                <h3>🤔 Changed your mind?</h3>
                <p style="color: #047857;">
                    Miss us already? You can always resubscribe and rejoin our crew of savvy travelers.
                </p>
                <a href="https://maxyourpoints.com" class="resubscribe-button">Resubscribe</a>
            </div>

            <div style="background: #fffbeb; border-radius: 8px; padding: 20px; margin: 25px 0;">
                <p style="color: #92400e; font-size: 16px;">
                    💡 <strong>Still curious?</strong> Explore our latest hacks and tools at
                    <a href="https://maxyourpoints.com" style="color: #d97706;">maxyourpoints.com</a>
                </p>
            </div>
        </div>

        <div class="footer">
            <h3 style="color: #10b981; margin-bottom: 15px;">Max Your Points</h3>
            <div class="social-links">
                <a href="https://x.com/max_your_points">Follow on X</a> |
                <a href="https://maxyourpoints.com">Visit Website</a> |
                <a href="mailto:isak@maxyourpoints.com">Contact Us</a>
            </div>
            <p style="color: #9ca3af; margin: 15px 0; font-size: 14px;">
                Thanks for flying with us 🛫
            </p>
            <p style="color: #6b7280; font-size: 12px;">
                Max Your Points | Built with love by Isak Parild
            </p>
        </div>
    </div>
</body>
</html>



weekly news letter...

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Max Your Points Weekly</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%); padding: 40px 20px; text-align: center; }
        .header h1 { color: white; font-size: 28px; margin-bottom: 10px; }
        .header p { color: rgba(255,255,255,0.9); font-size: 16px; }
        .content { padding: 30px 20px; }
        .date-badge { background: #ecfdf5; color: #065f46; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; margin-bottom: 30px; display: inline-block; }
        .intro { font-size: 18px; color: #374151; margin-bottom: 30px; }
        .articles-section { margin: 30px 0; }
        .articles-title { color: #0f766e; font-size: 24px; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #14b8a6; }
        .article-item { background: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #14b8a6; }
        .article-title { color: #0f766e; font-size: 20px; font-weight: 600; margin-bottom: 10px; }
        .article-excerpt { color: #4b5563; font-size: 16px; margin-bottom: 15px; }
        .article-link { background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; }
        .footer { background: #1f2937; color: white; padding: 30px 20px; text-align: center; }
        .social-links { margin: 20px 0; }
        .social-links a { color: #14b8a6; text-decoration: none; margin: 0 10px; }
        .unsubscribe { font-size: 12px; color: #9ca3af; margin-top: 20px; }
        .unsubscribe a { color: #14b8a6; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Max Your Points Weekly ✈️</h1>
            <p>Welcome aboard your weekly upgrade of hacks, tips & points perks!</p>
        </div>

        <div class="content">
            <div class="date-badge">{{date}}</div>

            <div class="intro">
                👋 Hey travel hacker,<br><br>
                Fasten your seatbelt – another week of top-tier strategies has landed in your inbox. Whether you’re eyeing a first-class upgrade or just trying to stretch your points to the max, we’ve got something juicy this week.
            </div>

            <div class="articles-section">
                <h2 class="articles-title">🔥 This Week’s Flight Plan</h2>

                <!-- ARTICLES WILL BE INSERTED HERE -->
                {{articles}}
            </div>

            <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); padding: 25px; border-radius: 12px; margin: 30px 0; text-align: center;">
                <h3 style="color: #065f46; margin-bottom: 15px;">💡 Weekly Travel Tip</h3>
                <p style="color: #047857; font-style: italic;">
                    "Always check award availability before transferring points – it’s like checking for turbulence before takeoff."
                </p>
            </div>
        </div>

        <div class="footer">
            <h3 style="color: #14b8a6; margin-bottom: 15px;">Stay Connected</h3>
            <div class="social-links">
                <a href="https://x.com/max_your_points">Follow us on X</a> |
                <a href="https://maxyourpoints.com">Visit our website</a>
            </div>
            <p style="color: #9ca3af;">
                Helping you board smarter, fly further, and live better – one point at a time.
            </p>
            <div class="unsubscribe">
                <p>Not feeling it anymore? <a href="{{unsubscribe_url}}">Unsubscribe here</a></p>
                <p>Max Your Points | Built with ✈️ by Isak Parild</p>
            </div>
        </div>
    </div>
</body>
</html>




Air fare of the day 

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Airfare Deal Alert</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #fef3c7; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px 20px; text-align: center; position: relative; }
        .header::before { content: "✈️"; font-size: 40px; position: absolute; top: -5px; right: 20px; opacity: 0.3; }
        .alert-badge { background: #dc2626; color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 15px; display: inline-block; }
        .header h1 { color: white; font-size: 32px; margin-bottom: 8px; font-weight: 700; }
        .header p { color: rgba(255,255,255,0.9); font-size: 18px; }
        .deal-highlight { background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%); padding: 30px 20px; text-align: center; border-bottom: 3px solid #f59e0b; }
        .price { font-size: 48px; font-weight: 900; color: #dc2626; margin: 10px 0; }
        .destination { font-size: 24px; color: #92400e; font-weight: 600; margin-bottom: 10px; }
        .deal-details { color: #78350f; font-size: 16px; }
        .content { padding: 30px 20px; }
        .urgency { background: #fef2f2; border: 2px solid #fecaca; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center; }
        .urgency h3 { color: #dc2626; font-size: 20px; margin-bottom: 10px; }
        .urgency p { color: #991b1b; font-weight: 600; }
        .cta-button { background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 18px 36px; text-decoration: none; border-radius: 12px; display: inline-block; font-weight: 700; font-size: 18px; margin: 20px 0; box-shadow: 0 4px 15px rgba(220,38,38,0.3); }
        .features { background: #f8fafc; border-radius: 12px; padding: 25px; margin: 25px 0; }
        .features h3 { color: #0f766e; margin-bottom: 15px; }
        .features ul { list-style: none; }
        .features li { color: #374151; margin-bottom: 8px; padding-left: 20px; position: relative; }
        .features li::before { content: "✓"; color: #10b981; font-weight: bold; position: absolute; left: 0; }
        .articles-section { margin: 30px 0; }
        .articles-title { color: #92400e; font-size: 20px; margin-bottom: 15px; }
        .article-item { background: #fffbeb; border-radius: 8px; padding: 15px; margin-bottom: 15px; border-left: 4px solid #f59e0b; }
        .article-title { color: #92400e; font-size: 16px; font-weight: 600; margin-bottom: 8px; }
        .article-excerpt { color: #78350f; font-size: 14px; margin-bottom: 10px; }
        .article-link { color: #d97706; text-decoration: none; font-weight: 600; font-size: 14px; }
        .footer { background: #1f2937; color: white; padding: 25px 20px; text-align: center; }
        .unsubscribe { font-size: 12px; color: #9ca3af; margin-top: 15px; }
        .unsubscribe a { color: #f59e0b; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="alert-badge">Deal Alert</div>
            <h1>🎉 You’ve Unlocked a Fare Gem!</h1>
            <p>One of the hottest deals just landed on our radar 🛬</p>
        </div>

        <div class="deal-highlight">
            <div class="destination">📍 {{destination}}</div>
            <div class="price">${{price}}</div>
            <div class="deal-details">Round-trip from {{origin}} | {{dates}}</div>
        </div>

        <div class="content">
            <div class="urgency">
                <h3>⏳ Don't Miss This!</h3>
                <p>These fares are known to vanish faster than free upgrades—usually within 24–48 hours.</p>
            </div>

            <div style="text-align: center;">
                <a href="{{booking_link}}" class="cta-button">Book This Deal Now →</a>
            </div>

            <div class="features">
                <h3>💎 Why This Deal Is a Winner:</h3>
                <ul>
                    <li>{{discount}}% off standard fares</li>
                    <li>Reputable airline, no shady layovers</li>
                    <li>Flexible change rules (great for planners and procrastinators)</li>
                    <li>Multiple departure dates available</li>
                    <li>Fantastic value for points/miles collectors</li>
                </ul>
            </div>

            <div class="articles-section">
                <h3 class="articles-title">📚 Travel Smarter With These Reads</h3>
                {{articles}}
            </div>

            <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
                <p style="color: #065f46; font-weight: 600;">
                    💡 Maximize it: Pay with your top-tier rewards card and stack those miles like a pro!
                </p>
            </div>
        </div>

        <div class="footer">
            <h3 style="color: #f59e0b; margin-bottom: 10px;">Max Your Points</h3>
            <p style="color: #9ca3af; font-size: 14px;">
                Handpicked deals. Daily tips. Zero fluff.
            </p>
            <div class="unsubscribe">
                <p>Prefer no more alerts? <a href="{{unsubscribe_url}}">Unsubscribe here</a></p>
                <p>Max Your Points | Built with ✈️ by Isak Parild</p>
            </div>
        </div>
    </div>
</body>
</html>



lets starteith thes and then we go fromthere 
