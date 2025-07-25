# STARBLUE Travel Management System - Backend

This is the Flask backend for the STARBLUE travel management system.

## Features

- **User Authentication**: Registration, login, logout with password hashing
- **Multi-modal Travel**: Support for flights, trains, and buses
- **Booking System**: Complete booking flow with confirmation codes
- **Payment Processing**: Simulated payment processing with multiple methods
- **Admin Panel**: Full CRUD operations for managing transport and bookings
- **Search & Tracking**: Real-time search and tracking functionality

## Database Models

- **User**: User accounts with admin privileges
- **Flight**: Flight information and scheduling
- **Train**: Train routes and scheduling  
- **Bus**: Bus routes and scheduling
- **Booking**: Customer bookings with confirmation codes

## Setup Instructions

1. **Install Dependencies**:
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`

2. **Database Setup**:
   - Install PostgreSQL
   - Create database named 'star'
   - Update connection string in app.py if needed

3. **Run Application**:
   \`\`\`bash
   python app.py
   \`\`\`

4. **Default Admin Account**:
   - Username: `admin`
   - Password: `admin123`

## API Endpoints

### Authentication
- `POST /login` - User login
- `POST /signup` - User registration
- `GET /logout` - User logout

### User Routes
- `GET /dashboard` - User dashboard
- `GET /search` - Search transport options
- `GET /book/<type>/<id>` - Book transport
- `POST /confirm_booking` - Confirm booking
- `GET /payment/<type>/<id>` - Payment page
- `POST /process_payment` - Process payment
- `GET /track` - Track transport
- `GET /manage_booking` - Manage bookings

### Admin Routes
- `GET /admin` - Admin dashboard
- `GET /admin/flights` - Manage flights
- `POST /admin/add_flight` - Add new flight
- `GET /admin/trains` - Manage trains
- `POST /admin/add_train` - Add new train
- `GET /admin/buses` - Manage buses
- `POST /admin/add_bus` - Add new bus
- `GET /admin/bookings` - View all bookings

## Database Configuration

The application uses PostgreSQL with the following connection:
\`\`\`
postgresql://postgres:9950@localhost/star
\`\`\`

Update the `SQLALCHEMY_DATABASE_URI` in `app.py` to match your database setup.

## Security Features

- Password hashing using Werkzeug
- Session-based authentication
- Admin privilege checking
- CSRF protection through Flask sessions
- Secure confirmation code generation
