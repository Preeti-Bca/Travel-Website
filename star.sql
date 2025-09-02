--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: FAQ; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."FAQ" (
    id integer NOT NULL,
    question character varying(500) NOT NULL,
    answer text NOT NULL,
    category character varying(100) NOT NULL,
    "order" integer,
    is_active boolean,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public."FAQ" OWNER TO postgres;

--
-- Name: FAQ_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."FAQ_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."FAQ_id_seq" OWNER TO postgres;

--
-- Name: FAQ_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."FAQ_id_seq" OWNED BY public."FAQ".id;


--
-- Name: blog_post; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.blog_post (
    id integer NOT NULL,
    title character varying(200) NOT NULL,
    slug character varying(200) NOT NULL,
    content text NOT NULL,
    excerpt text,
    featured_image character varying(255),
    author_id integer NOT NULL,
    category character varying(100),
    tags character varying(255),
    status character varying(20),
    views integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.blog_post OWNER TO postgres;

--
-- Name: blog_post_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.blog_post_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.blog_post_id_seq OWNER TO postgres;

--
-- Name: blog_post_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.blog_post_id_seq OWNED BY public.blog_post.id;


--
-- Name: booking; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.booking (
    id integer NOT NULL,
    booking_id character varying(20) NOT NULL,
    user_id integer NOT NULL,
    transport_type character varying(20) NOT NULL,
    transport_id integer NOT NULL,
    passenger_name character varying(100) NOT NULL,
    passenger_email character varying(120) NOT NULL,
    passenger_phone character varying(20) NOT NULL,
    passenger_age integer,
    passenger_gender character varying(10),
    booking_date timestamp without time zone,
    travel_date date NOT NULL,
    status character varying(20),
    booking_status character varying(20),
    total_amount double precision NOT NULL,
    payment_status character varying(20),
    payment_method character varying(50),
    seat_number character varying(10),
    special_requests text,
    from_location character varying(100),
    to_location character varying(100),
    departure_time character varying(20)
);


ALTER TABLE public.booking OWNER TO postgres;

--
-- Name: booking_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.booking_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.booking_id_seq OWNER TO postgres;

--
-- Name: booking_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.booking_id_seq OWNED BY public.booking.id;


--
-- Name: bus; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bus (
    id integer NOT NULL,
    bus_number character varying(20) NOT NULL,
    operator character varying(100) NOT NULL,
    from_location character varying(100) NOT NULL,
    to_location character varying(100) NOT NULL,
    departure_time timestamp without time zone NOT NULL,
    arrival_time timestamp without time zone NOT NULL,
    price double precision NOT NULL,
    available_seats integer NOT NULL,
    total_seats integer NOT NULL,
    bus_type character varying(50),
    status character varying(20),
    created_at timestamp without time zone
);


ALTER TABLE public.bus OWNER TO postgres;

--
-- Name: bus_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bus_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bus_id_seq OWNER TO postgres;

--
-- Name: bus_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bus_id_seq OWNED BY public.bus.id;


--
-- Name: contact_message; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contact_message (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(120) NOT NULL,
    subject character varying(200) NOT NULL,
    message text NOT NULL,
    created_at timestamp without time zone,
    is_read boolean
);


ALTER TABLE public.contact_message OWNER TO postgres;

--
-- Name: contact_message_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contact_message_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contact_message_id_seq OWNER TO postgres;

--
-- Name: contact_message_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contact_message_id_seq OWNED BY public.contact_message.id;


--
-- Name: dynamic_page; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dynamic_page (
    id integer NOT NULL,
    title character varying(200) NOT NULL,
    slug character varying(200) NOT NULL,
    content text NOT NULL,
    meta_description character varying(255),
    meta_keywords character varying(255),
    template character varying(100),
    status character varying(20),
    show_in_menu boolean,
    menu_order integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.dynamic_page OWNER TO postgres;

--
-- Name: dynamic_page_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.dynamic_page_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dynamic_page_id_seq OWNER TO postgres;

--
-- Name: dynamic_page_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.dynamic_page_id_seq OWNED BY public.dynamic_page.id;


--
-- Name: faq; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.faq (
    id integer NOT NULL,
    question character varying(500) NOT NULL,
    answer text NOT NULL,
    category character varying(100) NOT NULL,
    "order" integer,
    is_active boolean,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.faq OWNER TO postgres;

--
-- Name: faq_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.faq_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.faq_id_seq OWNER TO postgres;

--
-- Name: faq_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.faq_id_seq OWNED BY public.faq.id;


--
-- Name: flight; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.flight (
    id integer NOT NULL,
    flight_number character varying(20) NOT NULL,
    airline character varying(100) NOT NULL,
    from_location character varying(100) NOT NULL,
    to_location character varying(100) NOT NULL,
    departure_time timestamp without time zone NOT NULL,
    arrival_time timestamp without time zone NOT NULL,
    price double precision NOT NULL,
    available_seats integer NOT NULL,
    total_seats integer NOT NULL,
    aircraft_type character varying(50),
    status character varying(20),
    created_at timestamp without time zone
);


ALTER TABLE public.flight OWNER TO postgres;

--
-- Name: flight_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.flight_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.flight_id_seq OWNER TO postgres;

--
-- Name: flight_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.flight_id_seq OWNED BY public.flight.id;


--
-- Name: train; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.train (
    id integer NOT NULL,
    train_number character varying(20) NOT NULL,
    train_name character varying(100) NOT NULL,
    from_location character varying(100) NOT NULL,
    to_location character varying(100) NOT NULL,
    departure_time timestamp without time zone NOT NULL,
    arrival_time timestamp without time zone NOT NULL,
    price double precision NOT NULL,
    available_seats integer NOT NULL,
    total_seats integer NOT NULL,
    train_type character varying(50),
    status character varying(20),
    created_at timestamp without time zone
);


ALTER TABLE public.train OWNER TO postgres;

--
-- Name: train_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.train_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.train_id_seq OWNER TO postgres;

--
-- Name: train_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.train_id_seq OWNED BY public.train.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    username character varying(80) NOT NULL,
    email character varying(120) NOT NULL,
    password_hash character varying(255) NOT NULL,
    phone character varying(20),
    full_name character varying(100),
    first_name character varying(50),
    last_name character varying(50),
    date_of_birth date,
    gender character varying(10),
    is_admin boolean,
    newsletter_subscribed boolean,
    created_at timestamp without time zone
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_id_seq OWNER TO postgres;

--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(80) NOT NULL,
    email character varying(120) NOT NULL,
    password_hash character varying(255) NOT NULL,
    is_admin boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: FAQ id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FAQ" ALTER COLUMN id SET DEFAULT nextval('public."FAQ_id_seq"'::regclass);


--
-- Name: blog_post id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blog_post ALTER COLUMN id SET DEFAULT nextval('public.blog_post_id_seq'::regclass);


--
-- Name: booking id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking ALTER COLUMN id SET DEFAULT nextval('public.booking_id_seq'::regclass);


--
-- Name: bus id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bus ALTER COLUMN id SET DEFAULT nextval('public.bus_id_seq'::regclass);


--
-- Name: contact_message id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_message ALTER COLUMN id SET DEFAULT nextval('public.contact_message_id_seq'::regclass);


--
-- Name: dynamic_page id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dynamic_page ALTER COLUMN id SET DEFAULT nextval('public.dynamic_page_id_seq'::regclass);


--
-- Name: faq id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faq ALTER COLUMN id SET DEFAULT nextval('public.faq_id_seq'::regclass);


--
-- Name: flight id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flight ALTER COLUMN id SET DEFAULT nextval('public.flight_id_seq'::regclass);


--
-- Name: train id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.train ALTER COLUMN id SET DEFAULT nextval('public.train_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: FAQ; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."FAQ" (id, question, answer, category, "order", is_active, created_at, updated_at) FROM stdin;
1	How can I cancel my flight booking?	You can cancel your flight booking by visiting the "Manage Booking" section in your dashboard. Click on the booking you want to cancel and select the cancel option. Please note that cancellation charges may apply depending on the airline's policy and timing of cancellation.	Flight Booking	1	t	2025-07-18 06:19:18.015973	2025-07-18 06:19:18.015973
2	What documents do I need for domestic flights?	For domestic flights in India, you need a valid government-issued photo ID such as Aadhaar Card, Passport, Driving License, or Voter ID. The name on your ID should match the name on your booking.	Flight Booking	2	t	2025-07-18 06:19:18.015973	2025-07-18 06:19:18.015973
3	How early should I reach the airport?	For domestic flights, arrive 2 hours before departure. For international flights, arrive 3 hours before departure. This allows sufficient time for check-in, security screening, and boarding procedures.	Flight Travel	1	t	2025-07-18 06:19:18.015973	2025-07-18 06:19:18.015973
4	Can I modify my train booking?	Yes, you can modify your train booking subject to availability and railway rules. You can change the date, passenger details, or boarding station through the IRCTC website or our platform. Modification charges may apply.	Train Booking	1	t	2025-07-18 06:19:18.015973	2025-07-18 06:19:18.015973
5	What is the baggage allowance for trains?	Indian Railways allows free baggage up to 40kg for AC First Class, 35kg for AC 2-Tier, 25kg for AC 3-Tier, and 40kg for Sleeper Class. Additional charges apply for excess baggage.	Train Travel	1	t	2025-07-18 06:19:18.015973	2025-07-18 06:19:18.015973
6	How do I track my bus in real-time?	You can track your bus in real-time using our tracking feature. Go to the "Track Booking" section, enter your booking ID, and you'll see the current location and estimated arrival time of your bus.	Bus Travel	1	t	2025-07-18 06:19:18.015973	2025-07-18 06:19:18.015973
\.


--
-- Data for Name: blog_post; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.blog_post (id, title, slug, content, excerpt, featured_image, author_id, category, tags, status, views, created_at, updated_at) FROM stdin;
1	Best Time to Book Flights for Maximum Savings	best-time-book-flights-savings	<h2>Introduction</h2><p>Discover the optimal timing strategies for booking flights to save money on your next trip. Understanding when airlines release their cheapest fares can help you save hundreds of dollars.</p><h3>Key Tips:</h3><ul><li>Book domestic flights 1-3 months in advance</li><li>Book international flights 2-8 months in advance</li><li>Tuesday afternoons often have the best deals</li><li>Avoid booking on weekends</li></ul><p>By following these simple guidelines, you can significantly reduce your travel costs.</p>	Learn when to book flights to get the best deals and save money on your next trip.	\N	1	Flight Tips	flights, savings, booking tips, travel	published	0	2025-07-18 06:19:17.984648	2025-07-18 06:19:17.984648
2	Complete Guide to Indian Railway Booking	complete-guide-indian-railway-booking	<h2>Railway Booking Made Easy</h2><p>Everything you need to know about booking train tickets in India efficiently and getting the best seats.</p><h3>Booking Process:</h3><ol><li>Create an IRCTC account</li><li>Search for trains between your destinations</li><li>Select your preferred train and class</li><li>Fill passenger details</li><li>Make payment</li></ol><h3>Pro Tips:</h3><ul><li>Book tickets 120 days in advance</li><li>Use Tatkal booking for last-minute travel</li><li>Check for alternative routes</li></ul>	A comprehensive guide to booking train tickets efficiently in India.	\N	1	Train Travel	trains, booking, india, railway	published	0	2025-07-18 06:19:17.984648	2025-07-18 06:19:17.984648
3	Top 10 Bus Travel Safety Tips	top-10-bus-travel-safety-tips	<h2>Stay Safe During Bus Travel</h2><p>Bus travel is one of the most economical ways to travel, but safety should always be your priority.</p><h3>Safety Tips:</h3><ol><li>Choose reputable bus operators</li><li>Keep your belongings secure</li><li>Stay hydrated during long journeys</li><li>Keep emergency contacts handy</li><li>Avoid traveling at night when possible</li></ol>	Essential safety tips for comfortable and secure bus travel.	\N	1	Bus Travel	bus, safety, travel tips	published	0	2025-07-18 06:19:17.984648	2025-07-18 06:19:17.984648
4	testing	testing	jdhsgfytfghsvcghdsfghfgsfyuegadhfgeysfdrtsxvchdb	hsgdshhgf	\N	1	bus	bus,booking	published	0	2025-07-22 06:36:36.735637	2025-07-22 06:36:36.735637
\.


--
-- Data for Name: booking; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.booking (id, booking_id, user_id, transport_type, transport_id, passenger_name, passenger_email, passenger_phone, passenger_age, passenger_gender, booking_date, travel_date, status, booking_status, total_amount, payment_status, payment_method, seat_number, special_requests, from_location, to_location, departure_time) FROM stdin;
\.


--
-- Data for Name: bus; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bus (id, bus_number, operator, from_location, to_location, departure_time, arrival_time, price, available_seats, total_seats, bus_type, status, created_at) FROM stdin;
1	MH12AB1234	RedBus Travels	Mumbai	Pune	2025-07-04 15:58:41.965144	2025-07-04 18:58:41.965144	800	35	40	AC Sleeper	Active	2025-07-03 04:28:41.969862
2	KA05CD5678	VRL Travels	Bangalore	Mysore	2025-07-05 19:58:41.965144	2025-07-05 22:58:41.965144	600	30	35	AC Semi-Sleeper	Active	2025-07-03 04:28:41.969862
3	DL01EF9012	Volvo Bus Service	Delhi	Manali	2025-07-07 07:58:41.965144	2025-07-07 19:58:41.965144	1500	25	30	Volvo AC	Active	2025-07-03 04:28:41.969862
\.


--
-- Data for Name: contact_message; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contact_message (id, name, email, subject, message, created_at, is_read) FROM stdin;
\.


--
-- Data for Name: dynamic_page; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dynamic_page (id, title, slug, content, meta_description, meta_keywords, template, status, show_in_menu, menu_order, created_at, updated_at) FROM stdin;
1	About STARBLUE	about	\n            <div class="about-content">\n                <h1>About STARBLUE</h1>\n                <p>STARBLUE is India's leading travel booking platform, dedicated to making your travel dreams come true with ease and affordability.</p>\n                \n                <h2>Our Mission</h2>\n                <p>To provide seamless, reliable, and cost-effective travel booking services that connect people to their destinations across India and beyond.</p>\n                \n                <h2>What We Offer</h2>\n                <ul>\n                    <li><strong>Flight Bookings:</strong> Domestic and international flights from all major airlines</li>\n                    <li><strong>Train Reservations:</strong> Easy booking for all classes and routes across Indian Railways</li>\n                    <li><strong>Bus Services:</strong> Comfortable bus travel with trusted operators nationwide</li>\n                </ul>\n                \n                <h2>Why Choose STARBLUE?</h2>\n                <div class="features-grid">\n                    <div class="feature">\n                        <h3>🚀 Fast Booking</h3>\n                        <p>Quick and easy booking process in just a few clicks</p>\n                    </div>\n                    <div class="feature">\n                        <h3>💰 Best Prices</h3>\n                        <p>Competitive prices and exclusive deals on all travel modes</p>\n                    </div>\n                    <div class="feature">\n                        <h3>🔒 Secure Payments</h3>\n                        <p>Safe and secure payment gateway with multiple options</p>\n                    </div>\n                    <div class="feature">\n                        <h3>📞 24/7 Support</h3>\n                        <p>Round-the-clock customer support for all your queries</p>\n                    </div>\n                </div>\n                \n                <h2>Our Journey</h2>\n                <p>Founded with a vision to revolutionize travel booking in India, STARBLUE has grown to become a trusted name in the travel industry. We serve thousands of customers daily, helping them reach their destinations safely and comfortably.</p>\n                \n                <h2>Contact Us</h2>\n                <p>Have questions or need assistance? Our customer support team is always ready to help you plan your perfect journey.</p>\n            </div>\n            	Learn about STARBLUE - India's premier travel booking platform for flights, trains, and buses	STARBLUE, travel booking, flights, trains, buses, India travel	dynamic_page.html	published	t	1	2025-07-18 06:19:18.028236	2025-07-18 06:19:18.028236
\.


--
-- Data for Name: faq; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.faq (id, question, answer, category, "order", is_active, created_at, updated_at) FROM stdin;
1	How can I cancel my flight booking?	You can cancel your flight booking by visiting the "Manage Booking" section in your dashboard. Click on the booking you want to cancel and select the cancel option. Please note that cancellation charges may apply depending on the airline's policy and timing of cancellation.	Flight Booking	1	t	2025-07-25 06:52:01.413631	2025-07-25 06:52:01.413631
2	What documents do I need for domestic flights?	For domestic flights in India, you need a valid government-issued photo ID such as Aadhaar Card, Passport, Driving License, or Voter ID. The name on your ID should match the name on your booking.	Flight Booking	2	t	2025-07-25 06:52:01.413631	2025-07-25 06:52:01.413631
3	How early should I reach the airport?	For domestic flights, arrive 2 hours before departure. For international flights, arrive 3 hours before departure. This allows sufficient time for check-in, security screening, and boarding procedures.	Flight Travel	1	t	2025-07-25 06:52:01.413631	2025-07-25 06:52:01.413631
4	Can I modify my train booking?	Yes, you can modify your train booking subject to availability and railway rules. You can change the date, passenger details, or boarding station through the IRCTC website or our platform. Modification charges may apply.	Train Booking	1	t	2025-07-25 06:52:01.413631	2025-07-25 06:52:01.413631
5	What is the baggage allowance for trains?	Indian Railways allows free baggage up to 40kg for AC First Class, 35kg for AC 2-Tier, 25kg for AC 3-Tier, and 40kg for Sleeper Class. Additional charges apply for excess baggage.	Train Travel	1	t	2025-07-25 06:52:01.413631	2025-07-25 06:52:01.413631
6	How do I track my bus in real-time?	You can track your bus in real-time using our tracking feature. Go to the "Track Booking" section, enter your booking ID, and you'll see the current location and estimated arrival time of your bus.	Bus Travel	1	t	2025-07-25 06:52:01.413631	2025-07-25 06:52:01.413631
7	how is the testing	very good	General	0	t	2025-07-25 07:29:04.30338	2025-07-25 07:29:04.30338
\.


--
-- Data for Name: flight; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.flight (id, flight_number, airline, from_location, to_location, departure_time, arrival_time, price, available_seats, total_seats, aircraft_type, status, created_at) FROM stdin;
1	AI101	Air India	Mumbai	Delhi	2025-07-04 17:58:41.963267	2025-07-04 20:28:41.963267	5500	150	180	Boeing 737	Active	2025-07-03 04:28:41.985451
2	SG202	SpiceJet	Bangalore	Chennai	2025-07-05 23:58:41.963267	2025-07-06 01:43:41.963267	3200	120	150	Airbus A320	Active	2025-07-03 04:28:41.985451
3	6E303	IndiGo	Delhi	Goa	2025-07-06 20:58:41.964638	2025-07-06 23:18:41.964638	4800	140	180	Airbus A321	Active	2025-07-03 04:28:41.985451
\.


--
-- Data for Name: train; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.train (id, train_number, train_name, from_location, to_location, departure_time, arrival_time, price, available_seats, total_seats, train_type, status, created_at) FROM stdin;
1	12951	Mumbai Rajdhani	Mumbai	Delhi	2025-07-05 01:58:41.964638	2025-07-05 17:58:41.964638	2800	200	300	Rajdhani Express	Active	2025-07-03 04:28:41.993894
2	12639	Brindavan Express	Bangalore	Chennai	2025-07-05 16:58:41.964638	2025-07-05 21:58:41.964638	1200	180	250	Express	Active	2025-07-03 04:28:41.993894
3	10103	Mandovi Express	Delhi	Goa	2025-07-07 05:58:41.964638	2025-07-08 03:58:41.964638	1800	160	220	Express	Active	2025-07-03 04:28:41.993894
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, username, email, password_hash, phone, full_name, first_name, last_name, date_of_birth, gender, is_admin, newsletter_subscribed, created_at) FROM stdin;
1	admin	admin@starblue.com	pbkdf2:sha256:260000$LG8fNF9ZpwDyOg1G$2983c44756acc497c789449b14fe40b0a4cac948bc57c7483d8e44b952bcb377	+1234567890	System Administrator	System	Administrator	\N	\N	t	f	2025-07-03 04:28:42.005117
2	user	user@example.com	pbkdf2:sha256:260000$RvbvZBWq1dn7ayrV$6859714a4988479ea72180182f9859c3bd70c6cca6ce49759072a2131a26921c	+9876543210	John Doe	John	Doe	\N	\N	f	f	2025-07-03 04:28:42.005117
3	preetinegi	preetinegi434@gmail.com	pbkdf2:sha256:260000$qLS6xu1uURVwRs8e$90bce6611c782585842166ab278a3d2dbd83f532164c20a1d69ae9d98bb3c470	8445903389	preeti negi	preeti	negi	2001-12-21	female	f	t	2025-07-03 04:34:47.358609
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, password_hash, is_admin, created_at) FROM stdin;
\.


--
-- Name: FAQ_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."FAQ_id_seq"', 6, true);


--
-- Name: blog_post_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.blog_post_id_seq', 4, true);


--
-- Name: booking_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.booking_id_seq', 1, false);


--
-- Name: bus_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bus_id_seq', 3, true);


--
-- Name: contact_message_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contact_message_id_seq', 1, false);


--
-- Name: dynamic_page_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.dynamic_page_id_seq', 1, true);


--
-- Name: faq_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.faq_id_seq', 7, true);


--
-- Name: flight_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.flight_id_seq', 3, true);


--
-- Name: train_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.train_id_seq', 3, true);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_id_seq', 3, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- Name: FAQ FAQ_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FAQ"
    ADD CONSTRAINT "FAQ_pkey" PRIMARY KEY (id);


--
-- Name: blog_post blog_post_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blog_post
    ADD CONSTRAINT blog_post_pkey PRIMARY KEY (id);


--
-- Name: blog_post blog_post_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blog_post
    ADD CONSTRAINT blog_post_slug_key UNIQUE (slug);


--
-- Name: booking booking_booking_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking
    ADD CONSTRAINT booking_booking_id_key UNIQUE (booking_id);


--
-- Name: booking booking_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking
    ADD CONSTRAINT booking_pkey PRIMARY KEY (id);


--
-- Name: bus bus_bus_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bus
    ADD CONSTRAINT bus_bus_number_key UNIQUE (bus_number);


--
-- Name: bus bus_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bus
    ADD CONSTRAINT bus_pkey PRIMARY KEY (id);


--
-- Name: contact_message contact_message_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_message
    ADD CONSTRAINT contact_message_pkey PRIMARY KEY (id);


--
-- Name: dynamic_page dynamic_page_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dynamic_page
    ADD CONSTRAINT dynamic_page_pkey PRIMARY KEY (id);


--
-- Name: dynamic_page dynamic_page_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dynamic_page
    ADD CONSTRAINT dynamic_page_slug_key UNIQUE (slug);


--
-- Name: faq faq_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faq
    ADD CONSTRAINT faq_pkey PRIMARY KEY (id);


--
-- Name: flight flight_flight_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flight
    ADD CONSTRAINT flight_flight_number_key UNIQUE (flight_number);


--
-- Name: flight flight_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flight
    ADD CONSTRAINT flight_pkey PRIMARY KEY (id);


--
-- Name: train train_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.train
    ADD CONSTRAINT train_pkey PRIMARY KEY (id);


--
-- Name: train train_train_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.train
    ADD CONSTRAINT train_train_number_key UNIQUE (train_number);


--
-- Name: user user_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_key UNIQUE (email);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: user user_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_username_key UNIQUE (username);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: blog_post blog_post_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blog_post
    ADD CONSTRAINT blog_post_author_id_fkey FOREIGN KEY (author_id) REFERENCES public."user"(id);


--
-- Name: booking booking_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking
    ADD CONSTRAINT booking_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- PostgreSQL database dump complete
--

