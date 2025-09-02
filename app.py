from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify, g
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, date, timedelta
import os
import random
import string
import re
from flask_migrate import Migrate
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

db = SQLAlchemy(app)
migrate = Migrate(app, db)




# app = Flask(__name__)
# app.Config['SECRET_KEY'] = 'starblue-secret-key-2024'
# app.Config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("DATABASE_URL")
# app.Config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# db = SQLAlchemy(app)
# migrate = Migrate(app, db)



# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(20))
    full_name = db.Column(db.String(100))
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    date_of_birth = db.Column(db.Date)
    gender = db.Column(db.String(10))
    is_admin = db.Column(db.Boolean, default=False)
    newsletter_subscribed = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    bookings = db.relationship('Booking', backref='user', lazy=True)

    def __repr__(self):
        return f'<User {self.username}>'

class Flight(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    flight_number = db.Column(db.String(20), unique=True, nullable=False)
    airline = db.Column(db.String(100), nullable=False)
    from_location = db.Column(db.String(100), nullable=False)
    to_location = db.Column(db.String(100), nullable=False)
    departure_time = db.Column(db.DateTime, nullable=False)
    arrival_time = db.Column(db.DateTime, nullable=False)
    price = db.Column(db.Float, nullable=False)
    available_seats = db.Column(db.Integer, nullable=False)
    total_seats = db.Column(db.Integer, nullable=False)
    aircraft_type = db.Column(db.String(50))
    status = db.Column(db.String(20), default='Active')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Flight {self.flight_number}>'

class Train(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    train_number = db.Column(db.String(20), unique=True, nullable=False)
    train_name = db.Column(db.String(100), nullable=False)
    from_location = db.Column(db.String(100), nullable=False)
    to_location = db.Column(db.String(100), nullable=False)
    departure_time = db.Column(db.DateTime, nullable=False)
    arrival_time = db.Column(db.DateTime, nullable=False)
    price = db.Column(db.Float, nullable=False)
    available_seats = db.Column(db.Integer, nullable=False)
    total_seats = db.Column(db.Integer, nullable=False)
    train_type = db.Column(db.String(50))
    status = db.Column(db.String(20), default='Active')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Train {self.train_number}>'

class Bus(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    bus_number = db.Column(db.String(20), unique=True, nullable=False)
    operator = db.Column(db.String(100), nullable=False)
    from_location = db.Column(db.String(100), nullable=False)
    to_location = db.Column(db.String(100), nullable=False)
    departure_time = db.Column(db.DateTime, nullable=False)
    arrival_time = db.Column(db.DateTime, nullable=False)
    price = db.Column(db.Float, nullable=False)
    available_seats = db.Column(db.Integer, nullable=False)
    total_seats = db.Column(db.Integer, nullable=False)
    bus_type = db.Column(db.String(50))
    status = db.Column(db.String(20), default='Active')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Bus {self.bus_number}>'

class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(db.String(20), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    transport_type = db.Column(db.String(20), nullable=False)  # flight, train, bus
    transport_id = db.Column(db.Integer, nullable=False)
    passenger_name = db.Column(db.String(100), nullable=False)
    passenger_email = db.Column(db.String(120), nullable=False)
    passenger_phone = db.Column(db.String(20), nullable=False)
    passenger_age = db.Column(db.Integer)
    passenger_gender = db.Column(db.String(10))
    booking_date = db.Column(db.DateTime, default=datetime.utcnow)
    travel_date = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(20), default='Pending')  # Pending, Confirmed, Cancelled
    booking_status = db.Column(db.String(20), default='pending')  # For template compatibility
    total_amount = db.Column(db.Float, nullable=False)
    payment_status = db.Column(db.String(20), default='Pending')  # Pending, Completed, Failed
    payment_method = db.Column(db.String(50))
    seat_number = db.Column(db.String(10))
    special_requests = db.Column(db.Text)
    from_location = db.Column(db.String(100))  # For template compatibility
    to_location = db.Column(db.String(100))    # For template compatibility
    departure_time = db.Column(db.String(20))  # For template compatibility

    def __repr__(self):
        return f'<Booking {self.booking_id}>'

class ContactMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    subject = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_read = db.Column(db.Boolean, default=False)

class BlogPost(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    slug = db.Column(db.String(200), unique=True, nullable=False)
    content = db.Column(db.Text, nullable=False)
    excerpt = db.Column(db.Text)
    featured_image = db.Column(db.String(255))
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    category = db.Column(db.String(100))
    tags = db.Column(db.String(255))
    status = db.Column(db.String(20), default='draft')  # draft, published
    views = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    author = db.relationship('User', backref='blog_posts')

    def __repr__(self):
        return f'<BlogPost {self.title}>'

class FAQ(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.String(500), nullable=False)
    answer = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(100), nullable=False)
    order = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<FAQ {self.question[:50]}>'

class DynamicPage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    slug = db.Column(db.String(200), unique=True, nullable=False)
    content = db.Column(db.Text, nullable=False)
    meta_description = db.Column(db.String(255))
    meta_keywords = db.Column(db.String(255))
    template = db.Column(db.String(100), default='dynamic_page.html')
    status = db.Column(db.String(20), default='published')  # draft, published
    show_in_menu = db.Column(db.Boolean, default=False)
    menu_order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<DynamicPage {self.title}>'

# Context processor to make current_user available in templates
@app.context_processor
def inject_user():
    current_user = None
    if 'user_id' in session:
        try:
            current_user = db.session.get(User, session['user_id'])
        except Exception as e:
            print(f"Error getting current user: {e}")
            current_user = None
    return dict(current_user=current_user)

@app.context_processor
def inject_menu_pages():
    menu_pages = DynamicPage.query.filter_by(
        status='published', 
        show_in_menu=True
    ).order_by(DynamicPage.menu_order).all()
    return dict(menu_pages=menu_pages)

# Helper functions
def generate_booking_id():
    return 'SB' + ''.join(random.choices(string.digits, k=8))

def generate_username(first_name, last_name):
    """Generate a unique username from first and last name"""
    base_username = f"{first_name.lower()}{last_name.lower()}"
    username = base_username
    counter = 1
    
    while User.query.filter_by(username=username).first():
        username = f"{base_username}{counter}"
        counter += 1
    
    return username

def is_admin():
    return session.get('is_admin', False)

def login_required(f):
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

def admin_required(f):
    def decorated_function(*args, **kwargs):
        if not is_admin():
            flash('Admin access required')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

def generate_slug(title):
    """Generate a URL-friendly slug from title"""
    import re
    slug = title.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'\s+', '-', slug)
    slug = slug.strip('-')
    return slug

# Initialize Database and Sample Data
def init_db():
    # Create tables if they don't exist
    db.create_all()
    
    # Check if admin user already exists
    if not User.query.filter_by(username='admin').first():
        admin = User(
            username='admin',
            email='admin@starblue.com',
            password_hash=generate_password_hash('kuldeep123'),
            full_name='System Administrator',
            first_name='System',
            last_name='Administrator',
            phone='+1234567890',
            is_admin=True
        )
        db.session.add(admin)
    
    # Check if regular user already exists
    if not User.query.filter_by(username='user').first():
        user = User(
            username='user',
            email='user@example.com',
            password_hash=generate_password_hash('user123'),
            full_name='John Doe',
            first_name='John',
            last_name='Doe',
            phone='+9876543210',
            is_admin=False
        )
        db.session.add(user)
    
    # Add sample flights only if they don't exist
    sample_flights_data = [
        ('AI101', 'Air India', 'Mumbai', 'Delhi', 8, 10.5, 5500.0, 150, 180, 'Boeing 737'),
        ('SG202', 'SpiceJet', 'Bangalore', 'Chennai', 14, 15.75, 3200.0, 120, 150, 'Airbus A320'),
        ('6E303', 'IndiGo', 'Delhi', 'Goa', 11, 13.33, 4800.0, 140, 180, 'Airbus A321')
    ]
    
    for flight_data in sample_flights_data:
        if not Flight.query.filter_by(flight_number=flight_data[0]).first():
            flight = Flight(
                flight_number=flight_data[0],
                airline=flight_data[1],
                from_location=flight_data[2],
                to_location=flight_data[3],
                departure_time=datetime.now() + timedelta(days=1, hours=int(flight_data[4])),
                arrival_time=datetime.now() + timedelta(days=1, hours=int(flight_data[5]), minutes=int((flight_data[5] % 1) * 60)),
                price=flight_data[6],
                available_seats=flight_data[7],
                total_seats=flight_data[8],
                aircraft_type=flight_data[9]
            )
            db.session.add(flight)
    
    # Add sample trains only if they don't exist
    sample_trains_data = [
        ('12951', 'Mumbai Rajdhani', 'Mumbai', 'Delhi', 16, 32, 2800.0, 200, 300, 'Rajdhani Express'),
        ('12639', 'Brindavan Express', 'Bangalore', 'Chennai', 31, 36, 1200.0, 180, 250, 'Express'),
        ('10103', 'Mandovi Express', 'Delhi', 'Goa', 68, 90, 1800.0, 160, 220, 'Express')
    ]
    
    for train_data in sample_trains_data:
        if not Train.query.filter_by(train_number=train_data[0]).first():
            train = Train(
                train_number=train_data[0],
                train_name=train_data[1],
                from_location=train_data[2],
                to_location=train_data[3],
                departure_time=datetime.now() + timedelta(hours=train_data[4]),
                arrival_time=datetime.now() + timedelta(hours=train_data[5]),
                price=train_data[6],
                available_seats=train_data[7],
                total_seats=train_data[8],
                train_type=train_data[9]
            )
            db.session.add(train)
    
    # Add sample buses only if they don't exist
    sample_buses_data = [
        ('MH12AB1234', 'RedBus Travels', 'Mumbai', 'Pune', 6, 9, 800.0, 35, 40, 'AC Sleeper'),
        ('KA05CD5678', 'VRL Travels', 'Bangalore', 'Mysore', 34, 37, 600.0, 30, 35, 'AC Semi-Sleeper'),
        ('DL01EF9012', 'Volvo Bus Service', 'Delhi', 'Manali', 70, 82, 1500.0, 25, 30, 'Volvo AC')
    ]
    
    for bus_data in sample_buses_data:
        if not Bus.query.filter_by(bus_number=bus_data[0]).first():
            bus = Bus(
                bus_number=bus_data[0],
                operator=bus_data[1],
                from_location=bus_data[2],
                to_location=bus_data[3],
                departure_time=datetime.now() + timedelta(hours=bus_data[4]),
                arrival_time=datetime.now() + timedelta(hours=bus_data[5]),
                price=bus_data[6],
                available_seats=bus_data[7],
                total_seats=bus_data[8],
                bus_type=bus_data[9]
            )
            db.session.add(bus)

    # Add sample blog posts only if they don't exist
    if not BlogPost.query.first():
        # Get admin user for blog posts
        admin_user = User.query.filter_by(username='admin').first()
        if admin_user:
            sample_posts = [
                BlogPost(
                    title='Best Time to Book Flights for Maximum Savings',
                    slug='best-time-book-flights-savings',
                    content='<h2>Introduction</h2><p>Discover the optimal timing strategies for booking flights to save money on your next trip. Understanding when airlines release their cheapest fares can help you save hundreds of dollars.</p><h3>Key Tips:</h3><ul><li>Book domestic flights 1-3 months in advance</li><li>Book international flights 2-8 months in advance</li><li>Tuesday afternoons often have the best deals</li><li>Avoid booking on weekends</li></ul><p>By following these simple guidelines, you can significantly reduce your travel costs.</p>',
                    excerpt='Learn when to book flights to get the best deals and save money on your next trip.',
                    category='Flight Tips',
                    tags='flights, savings, booking tips, travel',
                    status='published',
                    author_id=admin_user.id
                ),
                BlogPost(
                    title='Complete Guide to Indian Railway Booking',
                    slug='complete-guide-indian-railway-booking',
                    content='<h2>Railway Booking Made Easy</h2><p>Everything you need to know about booking train tickets in India efficiently and getting the best seats.</p><h3>Booking Process:</h3><ol><li>Create an IRCTC account</li><li>Search for trains between your destinations</li><li>Select your preferred train and class</li><li>Fill passenger details</li><li>Make payment</li></ol><h3>Pro Tips:</h3><ul><li>Book tickets 120 days in advance</li><li>Use Tatkal booking for last-minute travel</li><li>Check for alternative routes</li></ul>',
                    excerpt='A comprehensive guide to booking train tickets efficiently in India.',
                    category='Train Travel',
                    tags='trains, booking, india, railway',
                    status='published',
                    author_id=admin_user.id
                ),
                BlogPost(
                    title='Top 10 Bus Travel Safety Tips',
                    slug='top-10-bus-travel-safety-tips',
                    content='<h2>Stay Safe During Bus Travel</h2><p>Bus travel is one of the most economical ways to travel, but safety should always be your priority.</p><h3>Safety Tips:</h3><ol><li>Choose reputable bus operators</li><li>Keep your belongings secure</li><li>Stay hydrated during long journeys</li><li>Keep emergency contacts handy</li><li>Avoid traveling at night when possible</li></ol>',
                    excerpt='Essential safety tips for comfortable and secure bus travel.',
                    category='Bus Travel',
                    tags='bus, safety, travel tips',
                    status='published',
                    author_id=admin_user.id
                )
            ]
            for post in sample_posts:
                db.session.add(post)

    # Add sample FAQs only if they don't exist
    if not FAQ.query.first():
        sample_faqs = [
            FAQ(
                question='How can I cancel my flight booking?',
                answer='You can cancel your flight booking by visiting the "Manage Booking" section in your dashboard. Click on the booking you want to cancel and select the cancel option. Please note that cancellation charges may apply depending on the airline\'s policy and timing of cancellation.',
                category='Flight Booking',
                order=1
            ),
            FAQ(
                question='What documents do I need for domestic flights?',
                answer='For domestic flights in India, you need a valid government-issued photo ID such as Aadhaar Card, Passport, Driving License, or Voter ID. The name on your ID should match the name on your booking.',
                category='Flight Booking',
                order=2
            ),
            FAQ(
                question='How early should I reach the airport?',
                answer='For domestic flights, arrive 2 hours before departure. For international flights, arrive 3 hours before departure. This allows sufficient time for check-in, security screening, and boarding procedures.',
                category='Flight Travel',
                order=1
            ),
            FAQ(
                question='Can I modify my train booking?',
                answer='Yes, you can modify your train booking subject to availability and railway rules. You can change the date, passenger details, or boarding station through the IRCTC website or our platform. Modification charges may apply.',
                category='Train Booking',
                order=1
            ),
            FAQ(
                question='What is the baggage allowance for trains?',
                answer='Indian Railways allows free baggage up to 40kg for AC First Class, 35kg for AC 2-Tier, 25kg for AC 3-Tier, and 40kg for Sleeper Class. Additional charges apply for excess baggage.',
                category='Train Travel',
                order=1
            ),
            FAQ(
                question='How do I track my bus in real-time?',
                answer='You can track your bus in real-time using our tracking feature. Go to the "Track Booking" section, enter your booking ID, and you\'ll see the current location and estimated arrival time of your bus.',
                category='Bus Travel',
                order=1
            )
        ]
        for faq in sample_faqs:
            db.session.add(faq)

    # Add sample dynamic pages only if they don't exist
    if not DynamicPage.query.filter_by(slug='about').first():
        about_page = DynamicPage(
            title='About STARBLUE',
            slug='about',
            content='''
            <div class="about-content">
                <h1>About STARBLUE</h1>
                <p>STARBLUE is India's leading travel booking platform, dedicated to making your travel dreams come true with ease and affordability.</p>
                
                <h2>Our Mission</h2>
                <p>To provide seamless, reliable, and cost-effective travel booking services that connect people to their destinations across India and beyond.</p>
                
                <h2>What We Offer</h2>
                <ul>
                    <li><strong>Flight Bookings:</strong> Domestic and international flights from all major airlines</li>
                    <li><strong>Train Reservations:</strong> Easy booking for all classes and routes across Indian Railways</li>
                    <li><strong>Bus Services:</strong> Comfortable bus travel with trusted operators nationwide</li>
                </ul>
                
                <h2>Why Choose STARBLUE?</h2>
                <div class="features-grid">
                    <div class="feature">
                        <h3>🚀 Fast Booking</h3>
                        <p>Quick and easy booking process in just a few clicks</p>
                    </div>
                    <div class="feature">
                        <h3>💰 Best Prices</h3>
                        <p>Competitive prices and exclusive deals on all travel modes</p>
                    </div>
                    <div class="feature">
                        <h3>🔒 Secure Payments</h3>
                        <p>Safe and secure payment gateway with multiple options</p>
                    </div>
                    <div class="feature">
                        <h3>📞 24/7 Support</h3>
                        <p>Round-the-clock customer support for all your queries</p>
                    </div>
                </div>
                
                <h2>Our Journey</h2>
                <p>Founded with a vision to revolutionize travel booking in India, STARBLUE has grown to become a trusted name in the travel industry. We serve thousands of customers daily, helping them reach their destinations safely and comfortably.</p>
                
                <h2>Contact Us</h2>
                <p>Have questions or need assistance? Our customer support team is always ready to help you plan your perfect journey.</p>
            </div>
            ''',
            meta_description='Learn about STARBLUE - India\'s premier travel booking platform for flights, trains, and buses',
            meta_keywords='STARBLUE, travel booking, flights, trains, buses, India travel',
            status='published',
            show_in_menu=True,
            menu_order=1
        )
        db.session.add(about_page)
    
    try:
        db.session.commit()
        print("Database initialized successfully!")
    except Exception as e:
        db.session.rollback()
        print(f"Error initializing database: {e}")
        print("Database may already contain some data. This is normal.")

# Main Routes
@app.route('/')
def index():
    # Get featured destinations and recent bookings for homepage
    featured_flights = Flight.query.limit(3).all()
    featured_trains = Train.query.limit(3).all()
    featured_buses = Bus.query.limit(3).all()
    
    return render_template('index.html', 
                         featured_flights=featured_flights,
                         featured_trains=featured_trains,
                         featured_buses=featured_buses)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password_hash, password):
            session['user_id'] = user.id
            session['username'] = user.username
            session['full_name'] = user.full_name
            session['is_admin'] = user.is_admin
            
            flash(f'Welcome back, {user.full_name}!', 'success')
            
            if user.is_admin:
                return redirect(url_for('admin_dashboard'))
            else:
                return redirect(url_for('dashboard'))
        else:
            flash('Invalid username or password', 'error')
    
    return render_template('login.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        # Get form data with the correct field names from your signup form
        first_name = request.form['first_name']
        last_name = request.form['last_name']
        email = request.form['email']
        mobile = request.form['mobile']
        password = request.form['password']
        confirm_password = request.form['confirm_password']
        date_of_birth = request.form.get('date_of_birth')
        gender = request.form.get('gender')
        newsletter = 'newsletter' in request.form
        
        # Validation
        if password != confirm_password:
            flash('Passwords do not match', 'error')
            return render_template('signup.html')
        
        if User.query.filter_by(email=email).first():
            flash('Email already exists', 'error')
            return render_template('signup.html')
        
        # Generate username from first and last name
        username = generate_username(first_name, last_name)
        full_name = f"{first_name} {last_name}"
        
        # Parse date of birth
        dob = None
        if date_of_birth:
            try:
                dob = datetime.strptime(date_of_birth, '%Y-%m-%d').date()
            except ValueError:
                flash('Invalid date of birth format', 'error')
                return render_template('signup.html')
        
        # Create new user
        user = User(
            username=username,
            email=email,
            password_hash=generate_password_hash(password),
            full_name=full_name,
            first_name=first_name,
            last_name=last_name,
            phone=mobile,
            date_of_birth=dob,
            gender=gender,
            newsletter_subscribed=newsletter
        )
        
        try:
            db.session.add(user)
            db.session.commit()
            flash(f'Registration successful! Your username is: {username}. Please login.', 'success')
            return redirect(url_for('login'))
        except Exception as e:
            db.session.rollback()
            flash('Registration failed. Please try again.', 'error')
            return render_template('signup.html')
    
    return render_template('signup.html')

@app.route('/forgot_password', methods=['GET', 'POST'])
def forgot_password():
    if request.method == 'POST':
        email = request.form['email']
        user = User.query.filter_by(email=email).first()
        
        if user:
            # In a real application, you would send an email with a reset token
            # For now, we'll just show a success message
            flash('If an account with that email exists, we have sent a password reset link.', 'info')
        else:
            # Don't reveal whether the email exists or not for security
            flash('If an account with that email exists, we have sent a password reset link.', 'info')
        
        return redirect(url_for('login'))
    
    return render_template('forgot_password.html')

@app.route('/dashboard')
@login_required
def dashboard():
    user_id = session['user_id']
    user = User.query.get(user_id)
    bookings = Booking.query.filter_by(user_id=user_id).order_by(Booking.booking_date.desc()).all()
    
    # Populate booking details from transport tables
    for booking in bookings:
        if booking.transport_type == 'flight':
            transport = Flight.query.get(booking.transport_id)
            if transport:
                booking.from_location = transport.from_location
                booking.to_location = transport.to_location
                booking.departure_time = transport.departure_time.strftime('%H:%M')
        elif booking.transport_type == 'train':
            transport = Train.query.get(booking.transport_id)
            if transport:
                booking.from_location = transport.from_location
                booking.to_location = transport.to_location
                booking.departure_time = transport.departure_time.strftime('%H:%M')
        elif booking.transport_type == 'bus':
            transport = Bus.query.get(booking.transport_id)
            if transport:
                booking.from_location = transport.from_location
                booking.to_location = transport.to_location
                booking.departure_time = transport.departure_time.strftime('%H:%M')
        
        # Set booking_status for template compatibility
        booking.booking_status = booking.status.lower()
    
    # Get booking statistics
    total_bookings = len(bookings)
    confirmed_bookings = len([b for b in bookings if b.status == 'Confirmed'])
    pending_bookings = len([b for b in bookings if b.status == 'Pending'])
    
    stats = {
        'total_bookings': total_bookings,
        'confirmed_bookings': confirmed_bookings,
        'pending_bookings': pending_bookings
    }
    
    return render_template('dashboard.html', user=user, bookings=bookings, stats=stats)

@app.route('/search', methods=['GET', 'POST'])
def search():
    results = []
    search_params = {}
    
    if request.method == 'POST':
        transport_type = request.form['transport_type']
        from_location = request.form['from_location']
        to_location = request.form['to_location']
        travel_date = request.form['travel_date']
        passengers = int(request.form.get('passengers', 1))
        
        search_params = {
            'transport_type': transport_type,
            'from_location': from_location,
            'to_location': to_location,
            'travel_date': travel_date,
            'passengers': passengers
        }
        
        if transport_type == 'flight':
            results = Flight.query.filter_by(
                from_location=from_location,
                to_location=to_location,
                status='Active'
            ).filter(Flight.available_seats >= passengers).all()
        elif transport_type == 'train':
            results = Train.query.filter_by(
                from_location=from_location,
                to_location=to_location,
                status='Active'
            ).filter(Train.available_seats >= passengers).all()
        elif transport_type == 'bus':
            results = Bus.query.filter_by(
                from_location=from_location,
                to_location=to_location,
                status='Active'
            ).filter(Bus.available_seats >= passengers).all()
    
    return render_template('search.html', results=results, search_params=search_params)

@app.route('/track', methods=['GET', 'POST'])
def track():
    booking = None
    if request.method == 'POST':
        booking_id = request.form['booking_id']
        email = request.form.get('email', '')
        
        booking = Booking.query.filter_by(booking_id=booking_id).first()
        if booking and email and booking.passenger_email != email:
            booking = None
            flash('Booking not found or email does not match', 'error')
        elif not booking:
            flash('Booking not found', 'error')
        else:
            # Get transport details
            transport = None
            if booking.transport_type == 'flight':
                transport = Flight.query.get(booking.transport_id)
            elif booking.transport_type == 'train':
                transport = Train.query.get(booking.transport_id)
            elif booking.transport_type == 'bus':
                transport = Bus.query.get(booking.transport_id)
            booking.transport_details = transport
    
    return render_template('track.html', booking=booking)

@app.route('/manage_booking/<booking_id>')
@login_required
def manage_booking(booking_id):
    if booking_id == 'all':
        # Show all bookings for the current user
        user_id = session['user_id']
        bookings = Booking.query.filter_by(user_id=user_id).order_by(Booking.booking_date.desc()).all()
        
        # Get transport details for each booking
        for booking in bookings:
            if booking.transport_type == 'flight':
                booking.transport_details = Flight.query.get(booking.transport_id)
            elif booking.transport_type == 'train':
                booking.transport_details = Train.query.get(booking.transport_id)
            elif booking.transport_type == 'bus':
                booking.transport_details = Bus.query.get(booking.transport_id)
        
        return render_template('manage_booking.html', bookings=bookings, booking=None)
    else:
        # Show specific booking
        booking = Booking.query.filter_by(booking_id=booking_id).first_or_404()
        
        # Verify booking belongs to current user
        if booking.user_id != session['user_id']:
            flash('Unauthorized access', 'error')
            return redirect(url_for('dashboard'))
        
        # Get transport details
        transport = None
        if booking.transport_type == 'flight':
            transport = Flight.query.get(booking.transport_id)
        elif booking.transport_type == 'train':
            transport = Train.query.get(booking.transport_id)
        elif booking.transport_type == 'bus':
            transport = Bus.query.get(booking.transport_id)
        
        booking.transport_details = transport
        
        return render_template('manage_booking.html', booking=booking, bookings=None)

@app.route('/profile', methods=['GET', 'POST'])
@login_required
def profile():
    user = User.query.get(session['user_id'])
    
    if request.method == 'POST':
        user.full_name = request.form['full_name']
        user.email = request.form['email']
        user.phone = request.form['phone']
        
        # Update password if provided
        new_password = request.form.get('new_password')
        if new_password:
            current_password = request.form['current_password']
            if check_password_hash(user.password_hash, current_password):
                user.password_hash = generate_password_hash(new_password)
                flash('Profile updated successfully!', 'success')
            else:
                flash('Current password is incorrect', 'error')
                return render_template('profile.html', user=user, now=datetime.utcnow())
        else:
            flash('Profile updated successfully!', 'success')
        
        db.session.commit()
        session['full_name'] = user.full_name
    
    return render_template('profile.html', user=user, now=datetime.utcnow())

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        subject = request.form['subject']
        message = request.form['message']
        
        contact_message = ContactMessage(
            name=name,
            email=email,
            subject=subject,
            message=message
        )
        db.session.add(contact_message)
        db.session.commit()
        
        flash('Thank you for your message! We will get back to you soon.', 'success')
        return redirect(url_for('contact'))
    
    return render_template('contact.html')

@app.route('/privacy')
def privacy():
    return render_template('privacy.html')

@app.route('/terms')
def terms():
    return render_template('terms.html')

# Add missing route for change_cancellation_policy
@app.route('/change-cancellation-policy')
def change_cancellation_policy():
    return render_template('change_cancellation_policy.html')

@app.route('/logout')
def logout():
    session.clear()
    flash('You have been logged out successfully', 'info')
    return redirect(url_for('index'))

# Blog Routes
@app.route('/blog')
def blog():
    page = request.args.get('page', 1, type=int)
    category = request.args.get('category', '')
    
    query = BlogPost.query.filter_by(status='published')
    if category:
        query = query.filter_by(category=category)
    
    posts = query.order_by(BlogPost.created_at.desc()).paginate(
        page=page, per_page=10, error_out=False
    )
    
    # Get categories for filter
    categories = db.session.query(BlogPost.category).filter_by(status='published').distinct().all()
    categories = [cat[0] for cat in categories if cat[0]]
    
    return render_template('blog.html', posts=posts, categories=categories, current_category=category)

@app.route('/blog/<slug>')
def blog_post(slug):
    post = BlogPost.query.filter_by(slug=slug, status='published').first_or_404()
    
    # Increment views
    post.views += 1
    db.session.commit()
    
    # Get related posts
    related_posts = BlogPost.query.filter(
        BlogPost.category == post.category,
        BlogPost.id != post.id,
        BlogPost.status == 'published'
    ).limit(3).all()
    
    return render_template('blog_post.html', post=post, related_posts=related_posts)

@app.route('/faq')
def faq():
    category = request.args.get('category', '')
    
    query = FAQ.query.filter_by(is_active=True)
    if category:
        query = query.filter_by(category=category)
    
    faqs = query.order_by(FAQ.order, FAQ.id).all()
    
    # Get categories for filter
    categories = db.session.query(FAQ.category).filter_by(is_active=True).distinct().all()
    categories = [cat[0] for cat in categories if cat[0]]
    
    return render_template('faq.html', faqs=faqs, categories=categories, current_category=category)

# Dynamic Page Route
@app.route('/page/<slug>')
def dynamic_page(slug):
    page = DynamicPage.query.filter_by(slug=slug, status='published').first_or_404()
    return render_template('dynamic_page.html', page=page)

# Admin Routes
@app.route('/admin/dashboard')
@admin_required
def admin_dashboard():
    # Get comprehensive statistics
    total_bookings = Booking.query.count()
    total_users = User.query.filter_by(is_admin=False).count()
    total_flights = Flight.query.count()
    total_trains = Train.query.count()
    total_buses = Bus.query.count()
    total_blog_posts = BlogPost.query.count()
    total_faqs = FAQ.query.count()
    total_pages = DynamicPage.query.count()
    
    # Revenue statistics
    total_revenue = db.session.query(db.func.sum(Booking.total_amount)).filter_by(payment_status='Completed').scalar() or 0
    pending_payments = db.session.query(db.func.sum(Booking.total_amount)).filter_by(payment_status='Pending').scalar() or 0
    
    # Recent data
    recent_bookings = Booking.query.order_by(Booking.booking_date.desc()).limit(5).all()
    recent_posts = BlogPost.query.order_by(BlogPost.created_at.desc()).limit(5).all()
    recent_users = User.query.order_by(User.created_at.desc()).limit(5).all()
    
    # Monthly booking stats
    monthly_bookings = db.session.query(
        db.func.date_trunc('month', Booking.booking_date).label('month'),
        db.func.count(Booking.id).label('count')
    ).group_by('month').order_by('month').limit(12).all()
    
    stats = {
        'total_bookings': total_bookings,
        'total_users': total_users,
        'total_flights': total_flights,
        'total_trains': total_trains,
        'total_buses': total_buses,
        'total_blog_posts': total_blog_posts,
        'total_faqs': total_faqs,
        'total_pages': total_pages,
        'total_revenue': total_revenue,
        'pending_payments': pending_payments
    }
    
    return render_template('admin/dashboard.html', 
                         stats=stats, 
                         recent_bookings=recent_bookings,
                         recent_posts=recent_posts,
                         recent_users=recent_users,
                         monthly_bookings=monthly_bookings)

@app.route('/admin/bookings')
@admin_required
def admin_bookings():
    page = request.args.get('page', 1, type=int)
    status_filter = request.args.get('status', '')
    transport_filter = request.args.get('transport', '')
    
    query = Booking.query
    
    if status_filter:
        query = query.filter_by(status=status_filter)
    if transport_filter:
        query = query.filter_by(transport_type=transport_filter)
    
    bookings = query.order_by(Booking.booking_date.desc()).paginate(
        page=page, per_page=20, error_out=False
    )
    
    return render_template('admin/bookings.html', bookings=bookings)

@app.route('/admin/flights')
@admin_required
def admin_flights():
    page = request.args.get('page', 1, type=int)
    flights = Flight.query.order_by(Flight.departure_time).paginate(
        page=page, per_page=20, error_out=False
    )
    return render_template('admin/flights.html', flights=flights)

@app.route('/admin/trains')
@admin_required
def admin_trains():
    page = request.args.get('page', 1, type=int)
    trains = Train.query.order_by(Train.departure_time).paginate(
        page=page, per_page=20, error_out=False
    )
    return render_template('admin/trains.html', trains=trains)

@app.route('/admin/buses')
@admin_required
def admin_buses():
    page = request.args.get('page', 1, type=int)
    buses = Bus.query.order_by(Bus.departure_time).paginate(
        page=page, per_page=20, error_out=False
    )
    return render_template('admin/buses.html', buses=buses)

@app.route('/admin/add_flight', methods=['GET', 'POST'])
@admin_required
def add_flight():
    if request.method == 'POST':
        flight = Flight(
            flight_number=request.form['flight_number'],
            airline=request.form['airline'],
            from_location=request.form['from_location'],
            to_location=request.form['to_location'],
            departure_time=datetime.strptime(request.form['departure_time'], '%Y-%m-%dT%H:%M'),
            arrival_time=datetime.strptime(request.form['arrival_time'], '%Y-%m-%dT%H:%M'),
            price=float(request.form['price']),
            available_seats=int(request.form['available_seats']),
            total_seats=int(request.form['total_seats']),
            aircraft_type=request.form.get('aircraft_type', '')
        )
        db.session.add(flight)
        db.session.commit()
        flash('Flight added successfully!', 'success')
        return redirect(url_for('admin_flights'))
    
    return render_template('admin/add_flight.html')

@app.route('/admin/add_train', methods=['GET', 'POST'])
@admin_required
def add_train():
    if request.method == 'POST':
        train = Train(
            train_number=request.form['train_number'],
            train_name=request.form['train_name'],
            from_location=request.form['from_location'],
            to_location=request.form['to_location'],
            departure_time=datetime.strptime(request.form['departure_time'], '%Y-%m-%dT%H:%M'),
            arrival_time=datetime.strptime(request.form['arrival_time'], '%Y-%m-%dT%H:%M'),
            price=float(request.form['price']),
            available_seats=int(request.form['available_seats']),
            total_seats=int(request.form['total_seats']),
            train_type=request.form.get('train_type', '')
        )
        db.session.add(train)
        db.session.commit()
        flash('Train added successfully!', 'success')
        return redirect(url_for('admin_trains'))
    
    return render_template('admin/add_train.html')

@app.route('/admin/add_bus', methods=['GET', 'POST'])
@admin_required
def add_bus():
    if request.method == 'POST':
        bus = Bus(
            bus_number=request.form['bus_number'],
            operator=request.form['operator'],
            from_location=request.form['from_location'],
            to_location=request.form['to_location'],
            departure_time=datetime.strptime(request.form['departure_time'], '%Y-%m-%dT%H:%M'),
            arrival_time=datetime.strptime(request.form['arrival_time'], '%Y-%m-%dT%H:%M'),
            price=float(request.form['price']),
            available_seats=int(request.form['available_seats']),
            total_seats=int(request.form['total_seats']),
            bus_type=request.form.get('bus_type', '')
        )
        db.session.add(bus)
        db.session.commit()
        flash('Bus added successfully!', 'success')
        return redirect(url_for('admin_buses'))
    
    return render_template('admin/add_bus.html')

@app.route('/admin/reports')
@admin_required
def admin_reports():
    # Revenue reports
    daily_revenue = db.session.query(
        db.func.date(Booking.booking_date).label('date'),
        db.func.sum(Booking.total_amount).label('revenue')
    ).filter_by(payment_status='Completed').group_by('date').order_by('date').limit(30).all()
    
    # Transport type statistics
    transport_stats = db.session.query(
        Booking.transport_type,
        db.func.count(Booking.id).label('count'),
        db.func.sum(Booking.total_amount).label('revenue')
    ).filter_by(payment_status='Completed').group_by(Booking.transport_type).all()
    
    # Monthly booking trends
    monthly_trends = db.session.query(
        db.func.date_trunc('month', Booking.booking_date).label('month'),
        db.func.count(Booking.id).label('bookings'),
        db.func.sum(Booking.total_amount).label('revenue')
    ).filter_by(payment_status='Completed').group_by('month').order_by('month').limit(12).all()
    
    return render_template('admin/reports.html',
                         daily_revenue=daily_revenue,
                         transport_stats=transport_stats,
                         monthly_trends=monthly_trends)

@app.route('/admin/settings', methods=['GET', 'POST'])
@admin_required
def admin_settings():
    if request.method == 'POST':
        # Handle settings update
        flash('Settings updated successfully!', 'success')
    
    # Get contact messages
    contact_messages = ContactMessage.query.order_by(ContactMessage.created_at.desc()).limit(10).all()
    
    return render_template('admin/settings.html', contact_messages=contact_messages)

@app.route('/admin/users')
@admin_required
def admin_users():
    page = request.args.get('page', 1, type=int)
    users = User.query.filter_by(is_admin=False).order_by(User.created_at.desc()).paginate(
        page=page, per_page=20, error_out=False
    )
    return render_template('admin/users.html', users=users)

@app.route('/admin/user/<int:user_id>')
@admin_required
def admin_user_detail(user_id):
    user = User.query.get_or_404(user_id)
    user_bookings = Booking.query.filter_by(user_id=user_id).order_by(Booking.booking_date.desc()).all()
    return render_template('admin/user_detail.html', user=user, bookings=user_bookings)

@app.route('/admin/user/<int:user_id>/toggle_status', methods=['POST'])
@admin_required
def toggle_user_status(user_id):
    user = User.query.get_or_404(user_id)
    # Add a status field to User model if needed
    # For now, we'll just return success
    flash(f'User {user.username} status updated successfully!', 'success')
    return redirect(url_for('admin_users'))

# Admin Blog Routes
@app.route('/admin/blog')
@admin_required
def admin_blog():
    page = request.args.get('page', 1, type=int)
    posts = BlogPost.query.order_by(BlogPost.created_at.desc()).paginate(
        page=page, per_page=20, error_out=False
    )
    return render_template('admin/blog.html', posts=posts)

@app.route('/admin/blog/add', methods=['GET', 'POST'])
@admin_required
def admin_add_blog():
    if request.method == 'POST':
        title = request.form.get('title')
        content = request.form.get('content')
        excerpt = request.form.get('excerpt', '')
        category = request.form.get('category', '')
        tags = request.form.get('tags', '')
        status = request.form.get('status', 'draft')
        if not title or not content:
            flash('Title and content are required', 'error')
            return redirect(url_for('admin_add_blog'))
        slug = generate_slug(title)
        # Ensure unique slug
        counter = 1
        original_slug = slug
        while BlogPost.query.filter_by(slug=slug).first():
            slug = f"{original_slug}-{counter}"
            counter += 1
        try:
            post = BlogPost(
                title=title,
                slug=slug,
                content=content,
                excerpt=excerpt,
                category=category,
                tags=tags,
                status=status,
                author_id=session['user_id']
            )
            db.session.add(post)
            db.session.commit()
            flash('Blog post created successfully!', 'success')
            return redirect(url_for('admin_blog'))
        except Exception as e:
            db.session.rollback()
            flash(f'Error creating blog post: {str(e)}', 'error')
            return redirect(url_for('admin_add_blog'))
    return render_template('admin/add_blog.html')

@app.route('/admin/blog/edit/<int:post_id>', methods=['GET', 'POST'])
@admin_required
def admin_edit_blog(post_id):
    post = BlogPost.query.get_or_404(post_id)
    
    if request.method == 'POST':
        post.title = request.form['title']
        post.content = request.form['content']
        post.excerpt = request.form.get('excerpt', '')
        post.category = request.form.get('category', '')
        post.tags = request.form.get('tags', '')
        post.status = request.form.get('status', 'draft')
        post.updated_at = datetime.utcnow()
        
        db.session.commit()
        flash('Blog post updated successfully!', 'success')
        return redirect(url_for('admin_blog'))
    
    return render_template('admin/edit_blog.html', post=post)

@app.route('/admin/blog/delete/<int:post_id>', methods=['POST'])
@admin_required
def admin_delete_blog(post_id):
    post = BlogPost.query.get_or_404(post_id)
    db.session.delete(post)
    db.session.commit()
    flash('Blog post deleted successfully!', 'success')
    return redirect(url_for('admin_blog'))

# Admin FAQ Routes
@app.route('/admin/faq')
@admin_required
def admin_faq():
    page = request.args.get('page', 1, type=int)
    faqs = FAQ.query.order_by(FAQ.category, FAQ.order).paginate(
        page=page, per_page=20, error_out=False
    )
    return render_template('admin/faq.html', faqs=faqs)

@app.route('/admin/faq/add', methods=['GET', 'POST'])
@admin_required
def admin_add_faq():
    if request.method == 'POST':
        faq = FAQ(
            question=request.form['question'],
            answer=request.form['answer'],
            category=request.form['category'],
            order=int(request.form.get('order', 0)),
            is_active=bool(request.form.get('is_active'))
        )
        
        db.session.add(faq)
        db.session.commit()
        flash('FAQ added successfully!', 'success')
        return redirect(url_for('admin_faq'))
    
    return render_template('admin/add_faq.html')

@app.route('/admin/faq/edit/<int:faq_id>', methods=['GET', 'POST'])
@admin_required
def admin_edit_faq(faq_id):
    faq = FAQ.query.get_or_404(faq_id)
    
    if request.method == 'POST':
        faq.question = request.form['question']
        faq.answer = request.form['answer']
        faq.category = request.form['category']
        faq.order = int(request.form.get('order', 0))
        faq.is_active = bool(request.form.get('is_active'))
        faq.updated_at = datetime.utcnow()
        
        db.session.commit()
        flash('FAQ updated successfully!', 'success')
        return redirect(url_for('admin_faq'))
    
    return render_template('admin/edit_faq.html', faq=faq)

@app.route('/admin/faq/delete/<int:faq_id>', methods=['POST'])
@admin_required
def admin_delete_faq(faq_id):
    faq = FAQ.query.get_or_404(faq_id)
    db.session.delete(faq)
    db.session.commit()
    flash('FAQ deleted successfully!', 'success')
    return redirect(url_for('admin_faq'))

# Admin Dynamic Pages Routes
@app.route('/admin/pages')
@admin_required
def admin_pages():
    page = request.args.get('page', 1, type=int)
    pages = DynamicPage.query.order_by(DynamicPage.created_at.desc()).paginate(
        page=page, per_page=20, error_out=False
    )
    return render_template('admin/pages.html', pages=pages)

@app.route('/admin/pages/add', methods=['GET', 'POST'])
@admin_required
def admin_add_page():
    if request.method == 'POST':
        title = request.form['title']
        slug = generate_slug(title)
        
        # Ensure unique slug
        counter = 1
        original_slug = slug
        while DynamicPage.query.filter_by(slug=slug).first():
            slug = f"{original_slug}-{counter}"
            counter += 1
        
        page = DynamicPage(
            title=title,
            slug=slug,
            content=request.form['content'],
            meta_description=request.form.get('meta_description', ''),
            meta_keywords=request.form.get('meta_keywords', ''),
            template=request.form.get('template', 'dynamic_page.html'),
            status=request.form.get('status', 'published'),
            show_in_menu=bool(request.form.get('show_in_menu')),
            menu_order=int(request.form.get('menu_order', 0))
        )
        
        db.session.add(page)
        db.session.commit()
        flash('Page created successfully!', 'success')
        return redirect(url_for('admin_pages'))
    
    return render_template('admin/add_page.html')

@app.route('/admin/pages/edit/<int:page_id>', methods=['GET', 'POST'])
@admin_required
def admin_edit_page(page_id):
    page = DynamicPage.query.get_or_404(page_id)
    
    if request.method == 'POST':
        page.title = request.form['title']
        page.content = request.form['content']
        page.meta_description = request.form.get('meta_description', '')
        page.meta_keywords = request.form.get('meta_keywords', '')
        page.template = request.form.get('template', 'dynamic_page.html')
        page.status = request.form.get('status', 'published')
        page.show_in_menu = bool(request.form.get('show_in_menu'))
        page.menu_order = int(request.form.get('menu_order', 0))
        page.updated_at = datetime.utcnow()
        
        db.session.commit()
        flash('Page updated successfully!', 'success')
        return redirect(url_for('admin_pages'))
    
    return render_template('admin/edit_page.html', page=page)

@app.route('/admin/pages/delete/<int:page_id>', methods=['POST'])
@admin_required
def admin_delete_page(page_id):
    page = DynamicPage.query.get_or_404(page_id)
    db.session.delete(page)
    db.session.commit()
    flash('Page deleted successfully!', 'success')
    return redirect(url_for('admin_pages'))

# API Routes
@app.route('/api/search')
def api_search():
    transport_type = request.args.get('transport_type')
    from_location = request.args.get('from_location')
    to_location = request.args.get('to_location')
    
    results = []
    if transport_type == 'flight':
        flights = Flight.query.filter_by(
            from_location=from_location,
            to_location=to_location,
            status='Active'
        ).all()
        results = [{
            'id': f.id,
            'number': f.flight_number,
            'name': f.airline,
            'price': f.price,
            'departure': f.departure_time.strftime('%H:%M'),
            'arrival': f.arrival_time.strftime('%H:%M'),
            'available_seats': f.available_seats
        } for f in flights]
    elif transport_type == 'train':
        trains = Train.query.filter_by(
            from_location=from_location,
            to_location=to_location,
            status='Active'
        ).all()
        results = [{
            'id': t.id,
            'number': t.train_number,
            'name': t.train_name,
            'price': t.price,
            'departure': t.departure_time.strftime('%H:%M'),
            'arrival': t.arrival_time.strftime('%H:%M'),
            'available_seats': t.available_seats
        } for t in trains]
    elif transport_type == 'bus':
        buses = Bus.query.filter_by(
            from_location=from_location,
            to_location=to_location,
            status='Active'
        ).all()
        results = [{
            'id': b.id,
            'number': b.bus_number,
            'name': b.operator,
            'price': b.price,
            'departure': b.departure_time.strftime('%H:%M'),
            'arrival': b.arrival_time.strftime('%H:%M'),
            'available_seats': b.available_seats
        } for b in buses]
    
    return jsonify(results)

@app.route('/api/booking/<booking_id>/cancel', methods=['POST'])
@login_required
def cancel_booking(booking_id):
    booking = Booking.query.filter_by(booking_id=booking_id).first_or_404()
    
    # Verify booking belongs to current user or user is admin
    if booking.user_id != session['user_id'] and not is_admin():
        return jsonify({'error': 'Unauthorized'}), 403
    
    booking.status = 'Cancelled'
    
    # Restore available seats
    if booking.transport_type == 'flight':
        transport = Flight.query.get(booking.transport_id)
        transport.available_seats += 1
    elif booking.transport_type == 'train':
        transport = Train.query.get(booking.transport_id)
        transport.available_seats += 1
    elif booking.transport_type == 'bus':
        transport = Bus.query.get(booking.transport_id)
        transport.available_seats += 1
    
    db.session.commit()
    
    return jsonify({'success': True, 'message': 'Booking cancelled successfully'})

# Error Handlers
@app.errorhandler(404)
def not_found_error(error):
    return render_template('errors/404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return render_template('errors/500.html'), 500

# Initialize the application
if __name__ == '__main__':
    with app.app_context():
        init_db()
    app.run(debug=True, host='0.0.0.0', port=5000)
