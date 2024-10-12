--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.4

-- Started on 2024-10-12 16:42:13

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
-- TOC entry 232 (class 1259 OID 16661)
-- Name: account; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    isactive boolean DEFAULT true,
    customerid integer,
    roleid integer
);


ALTER TABLE public.account OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16660)
-- Name: account_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.account_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.account_id_seq OWNER TO postgres;

--
-- TOC entry 4943 (class 0 OID 0)
-- Dependencies: 231
-- Name: account_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.account_id_seq OWNED BY public.account.id;


--
-- TOC entry 234 (class 1259 OID 16752)
-- Name: bookingdetails; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bookingdetails (
    id integer NOT NULL,
    bookingid integer NOT NULL,
    roomid integer NOT NULL
);


ALTER TABLE public.bookingdetails OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16751)
-- Name: bookingdetails_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bookingdetails_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bookingdetails_id_seq OWNER TO postgres;

--
-- TOC entry 4944 (class 0 OID 0)
-- Dependencies: 233
-- Name: bookingdetails_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bookingdetails_id_seq OWNED BY public.bookingdetails.id;


--
-- TOC entry 230 (class 1259 OID 16639)
-- Name: bookings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bookings (
    id integer NOT NULL,
    checkindate date NOT NULL,
    checkoutdate date NOT NULL,
    totalamount integer NOT NULL,
    customerid integer,
    bookingstatusid integer
);


ALTER TABLE public.bookings OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16638)
-- Name: bookings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bookings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bookings_id_seq OWNER TO postgres;

--
-- TOC entry 4945 (class 0 OID 0)
-- Dependencies: 229
-- Name: bookings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bookings_id_seq OWNED BY public.bookings.id;


--
-- TOC entry 224 (class 1259 OID 16598)
-- Name: bookingstatus; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bookingstatus (
    id integer NOT NULL,
    name character varying(255) DEFAULT 'Pending'::character varying
);


ALTER TABLE public.bookingstatus OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16597)
-- Name: bookingstatus_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bookingstatus_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bookingstatus_id_seq OWNER TO postgres;

--
-- TOC entry 4946 (class 0 OID 0)
-- Dependencies: 223
-- Name: bookingstatus_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bookingstatus_id_seq OWNED BY public.bookingstatus.id;


--
-- TOC entry 222 (class 1259 OID 16589)
-- Name: customer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    birthday date,
    phone character varying(255),
    address character varying(255),
    identificationnumber character varying(255),
    email character varying(255)
);


ALTER TABLE public.customer OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16588)
-- Name: customer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.customer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.customer_id_seq OWNER TO postgres;

--
-- TOC entry 4947 (class 0 OID 0)
-- Dependencies: 221
-- Name: customer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.customer_id_seq OWNED BY public.customer.id;


--
-- TOC entry 220 (class 1259 OID 16582)
-- Name: role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role (
    id integer NOT NULL,
    name character varying(255)
);


ALTER TABLE public.role OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16581)
-- Name: role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.role_id_seq OWNER TO postgres;

--
-- TOC entry 4948 (class 0 OID 0)
-- Dependencies: 219
-- Name: role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.role_id_seq OWNED BY public.role.id;


--
-- TOC entry 226 (class 1259 OID 16606)
-- Name: room; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.room (
    id integer NOT NULL,
    roomnumber character varying(255) NOT NULL,
    floor integer NOT NULL,
    price integer NOT NULL,
    bedsnumber integer NOT NULL,
    hasaircondition boolean NOT NULL,
    description character varying(255),
    roomtypeid integer,
    roomstatusid integer
);


ALTER TABLE public.room OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16605)
-- Name: room_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.room_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.room_id_seq OWNER TO postgres;

--
-- TOC entry 4949 (class 0 OID 0)
-- Dependencies: 225
-- Name: room_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.room_id_seq OWNED BY public.room.id;


--
-- TOC entry 228 (class 1259 OID 16625)
-- Name: roomimage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roomimage (
    id integer NOT NULL,
    url character varying(255) NOT NULL,
    roomid integer
);


ALTER TABLE public.roomimage OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16624)
-- Name: roomimage_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roomimage_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roomimage_id_seq OWNER TO postgres;

--
-- TOC entry 4950 (class 0 OID 0)
-- Dependencies: 227
-- Name: roomimage_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roomimage_id_seq OWNED BY public.roomimage.id;


--
-- TOC entry 216 (class 1259 OID 16567)
-- Name: roomstatus; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roomstatus (
    id integer NOT NULL,
    name character varying(255) DEFAULT 'Available'::character varying
);


ALTER TABLE public.roomstatus OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16566)
-- Name: roomstatus_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roomstatus_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roomstatus_id_seq OWNER TO postgres;

--
-- TOC entry 4951 (class 0 OID 0)
-- Dependencies: 215
-- Name: roomstatus_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roomstatus_id_seq OWNED BY public.roomstatus.id;


--
-- TOC entry 218 (class 1259 OID 16575)
-- Name: roomtype; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roomtype (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.roomtype OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16574)
-- Name: roomtype_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roomtype_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roomtype_id_seq OWNER TO postgres;

--
-- TOC entry 4952 (class 0 OID 0)
-- Dependencies: 217
-- Name: roomtype_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roomtype_id_seq OWNED BY public.roomtype.id;


--
-- TOC entry 4743 (class 2604 OID 16664)
-- Name: account id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account ALTER COLUMN id SET DEFAULT nextval('public.account_id_seq'::regclass);


--
-- TOC entry 4745 (class 2604 OID 16755)
-- Name: bookingdetails id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookingdetails ALTER COLUMN id SET DEFAULT nextval('public.bookingdetails_id_seq'::regclass);


--
-- TOC entry 4742 (class 2604 OID 16642)
-- Name: bookings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings ALTER COLUMN id SET DEFAULT nextval('public.bookings_id_seq'::regclass);


--
-- TOC entry 4738 (class 2604 OID 16601)
-- Name: bookingstatus id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookingstatus ALTER COLUMN id SET DEFAULT nextval('public.bookingstatus_id_seq'::regclass);


--
-- TOC entry 4737 (class 2604 OID 16592)
-- Name: customer id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer ALTER COLUMN id SET DEFAULT nextval('public.customer_id_seq'::regclass);


--
-- TOC entry 4736 (class 2604 OID 16585)
-- Name: role id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role ALTER COLUMN id SET DEFAULT nextval('public.role_id_seq'::regclass);


--
-- TOC entry 4740 (class 2604 OID 16609)
-- Name: room id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.room ALTER COLUMN id SET DEFAULT nextval('public.room_id_seq'::regclass);


--
-- TOC entry 4741 (class 2604 OID 16628)
-- Name: roomimage id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roomimage ALTER COLUMN id SET DEFAULT nextval('public.roomimage_id_seq'::regclass);


--
-- TOC entry 4733 (class 2604 OID 16570)
-- Name: roomstatus id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roomstatus ALTER COLUMN id SET DEFAULT nextval('public.roomstatus_id_seq'::regclass);


--
-- TOC entry 4735 (class 2604 OID 16578)
-- Name: roomtype id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roomtype ALTER COLUMN id SET DEFAULT nextval('public.roomtype_id_seq'::regclass);


--
-- TOC entry 4935 (class 0 OID 16661)
-- Dependencies: 232
-- Data for Name: account; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.account (id, username, password, isactive, customerid, roleid) FROM stdin;
15	khoaIT06	$2a$10$NQ4JfRjYilPrBYNAn5y42etHdNL6L12tERPQ8cXBlOV/H4AD4Y466	t	61	2
16	khoait123	$2a$10$nl1GGAwiXF618pV6gnh8xeeFYHWL.YDyt3gLNqSKqaP0Nurqy2516	t	66	1
11	khoait069	$2a$10$XdiFz.9pjq8Lsn1Zk3U1z.G2AU6XDfU/PzMAvz.fExXMX7FRYgLfu	t	51	1
1	admin	$2a$10$XdiFz.9pjq8Lsn1Zk3U1z.G2AU6XDfU/PzMAvz.fExXMX7FRYgLfu	t	1	1
8	khoait067	$2a$10$XdiFz.9pjq8Lsn1Zk3U1z.G2AU6XDfU/PzMAvz.fExXMX7FRYgLfu	t	48	2
\.


--
-- TOC entry 4937 (class 0 OID 16752)
-- Dependencies: 234
-- Data for Name: bookingdetails; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bookingdetails (id, bookingid, roomid) FROM stdin;
77	91	2
78	91	1
79	92	8
80	93	3
81	94	4
82	94	5
83	95	7
\.


--
-- TOC entry 4933 (class 0 OID 16639)
-- Dependencies: 230
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bookings (id, checkindate, checkoutdate, totalamount, customerid, bookingstatusid) FROM stdin;
92	2024-10-09	2024-10-13	2400000	62	2
91	2024-09-08	2024-09-10	1200000	61	2
93	2024-08-08	2024-08-10	500000	63	2
94	2024-10-13	2024-10-15	1100000	65	2
95	2024-10-13	2024-10-15	1200000	66	2
\.


--
-- TOC entry 4927 (class 0 OID 16598)
-- Dependencies: 224
-- Data for Name: bookingstatus; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bookingstatus (id, name) FROM stdin;
1	Pending
2	Confirmed
3	Cancelled
\.


--
-- TOC entry 4925 (class 0 OID 16589)
-- Dependencies: 222
-- Data for Name: customer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer (id, name, birthday, phone, address, identificationnumber, email) FROM stdin;
1	Nguyễn Văn A	1985-03-25	0869072497	123 Đường Phạm Hữu Lầu	087203015527	nguyenvana@gmail.com
66	Trần Đăng Khoa	2006-06-14	0869072497	Thành phố Cao Lãnh	087203015522	trandangkhoantl@gmail.com
67	Trần Đăng Kha	2003-06-04	0869072497	123 đường Phạm Hữu Lầu	112345678912	test@gmail.com
51	Nguyễn Thị Minh Anh	2003-06-04	0869072497	Thành phố Cao Lãnh	087203015529	trandangkhoantl12@gmail.com
48	Trần Đăng Khoa	2003-06-04	0869072497	Thành phố Cao Lãnh	077203015529	trandangkhoantl11@gmail.com
62	Trần Duy Đăng	2004-06-14	0869072493	Thành phố Cao Lãnh	087203015555	tranduydang@gmail.com
63	Nguyễn Hưu Vĩnh	2003-05-06	0869072491	Thành phố Cao Lãnh	087203015518	nguyenhuuvinh@gmail.com
61	Nguyễn Thành Danh	2003-06-24	0869072497	Thành phố Cao Lãnh	087203015523	trandangkhoantl33@gmail.com
65	Trần Đăng Khoa	2003-06-13	0869072497	Thành phố Cao Lãnh	087203015551	08690724997@gmail.com
\.


--
-- TOC entry 4923 (class 0 OID 16582)
-- Dependencies: 220
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role (id, name) FROM stdin;
1	Admin
2	Customer
\.


--
-- TOC entry 4929 (class 0 OID 16606)
-- Dependencies: 226
-- Data for Name: room; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.room (id, roomnumber, floor, price, bedsnumber, hasaircondition, description, roomtypeid, roomstatusid) FROM stdin;
8	206	2	600000	3	t	Suite cao cấp với các tính năng nổi bật.	3	2
6	202	2	500000	3	t	Suite sang trọng với giường cỡ king.	4	3
7	205	2	600000	2	t	Phòng superior với tiện nghi thêm.	4	2
1	101	1	200000	1	t	Phòng đơn ấm cúng.	1	1
2	102	1	400000	2	t	Phòng đôi rộng rãi.	2	1
3	103	1	250000	1	t	Phòng tiêu chuẩn với giường đơn.	1	1
4	104	1	150000	2	f	Phòng đôi thoải mái không có điều hòa.	2	1
5	201	2	400000	2	t	Phòng deluxe với view đẹp.	3	1
\.


--
-- TOC entry 4931 (class 0 OID 16625)
-- Dependencies: 228
-- Data for Name: roomimage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roomimage (id, url, roomid) FROM stdin;
1	uploads/imgtest.jpg	1
2	uploads/imgtest1.jpg	2
4	uploads/imgtest.jpg	4
5	uploads/imgtest1.jpg	5
7	uploads/imgtest.jpg	7
8	uploads/imgtest.jpg	8
10	uploads/imgtest1.jpg	1
9	uploads/imgtest2.jpg	1
6	uploads/imgtest.jpg	6
3	uploads/imgtest2.jpg	3
\.


--
-- TOC entry 4919 (class 0 OID 16567)
-- Dependencies: 216
-- Data for Name: roomstatus; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roomstatus (id, name) FROM stdin;
1	Available
3	Out of service
2	Booked
\.


--
-- TOC entry 4921 (class 0 OID 16575)
-- Dependencies: 218
-- Data for Name: roomtype; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roomtype (id, name) FROM stdin;
1	VIP
2	DELUXE
3	STANDARD
4	SUPERIOR
\.


--
-- TOC entry 4953 (class 0 OID 0)
-- Dependencies: 231
-- Name: account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.account_id_seq', 16, true);


--
-- TOC entry 4954 (class 0 OID 0)
-- Dependencies: 233
-- Name: bookingdetails_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bookingdetails_id_seq', 83, true);


--
-- TOC entry 4955 (class 0 OID 0)
-- Dependencies: 229
-- Name: bookings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bookings_id_seq', 95, true);


--
-- TOC entry 4956 (class 0 OID 0)
-- Dependencies: 223
-- Name: bookingstatus_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bookingstatus_id_seq', 5, true);


--
-- TOC entry 4957 (class 0 OID 0)
-- Dependencies: 221
-- Name: customer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customer_id_seq', 67, true);


--
-- TOC entry 4958 (class 0 OID 0)
-- Dependencies: 219
-- Name: role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.role_id_seq', 2, true);


--
-- TOC entry 4959 (class 0 OID 0)
-- Dependencies: 225
-- Name: room_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.room_id_seq', 30, true);


--
-- TOC entry 4960 (class 0 OID 0)
-- Dependencies: 227
-- Name: roomimage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roomimage_id_seq', 56, true);


--
-- TOC entry 4961 (class 0 OID 0)
-- Dependencies: 215
-- Name: roomstatus_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roomstatus_id_seq', 8, true);


--
-- TOC entry 4962 (class 0 OID 0)
-- Dependencies: 217
-- Name: roomtype_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roomtype_id_seq', 6, true);


--
-- TOC entry 4763 (class 2606 OID 16669)
-- Name: account account_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (id);


--
-- TOC entry 4765 (class 2606 OID 16757)
-- Name: bookingdetails bookingdetails_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookingdetails
    ADD CONSTRAINT bookingdetails_pkey PRIMARY KEY (id);


--
-- TOC entry 4761 (class 2606 OID 16644)
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- TOC entry 4755 (class 2606 OID 16604)
-- Name: bookingstatus bookingstatus_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookingstatus
    ADD CONSTRAINT bookingstatus_pkey PRIMARY KEY (id);


--
-- TOC entry 4753 (class 2606 OID 16596)
-- Name: customer customer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer
    ADD CONSTRAINT customer_pkey PRIMARY KEY (id);


--
-- TOC entry 4751 (class 2606 OID 16587)
-- Name: role role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_pkey PRIMARY KEY (id);


--
-- TOC entry 4757 (class 2606 OID 16613)
-- Name: room room_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.room
    ADD CONSTRAINT room_pkey PRIMARY KEY (id);


--
-- TOC entry 4759 (class 2606 OID 16632)
-- Name: roomimage roomimage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roomimage
    ADD CONSTRAINT roomimage_pkey PRIMARY KEY (id);


--
-- TOC entry 4747 (class 2606 OID 16573)
-- Name: roomstatus roomstatus_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roomstatus
    ADD CONSTRAINT roomstatus_pkey PRIMARY KEY (id);


--
-- TOC entry 4749 (class 2606 OID 16580)
-- Name: roomtype roomtype_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roomtype
    ADD CONSTRAINT roomtype_pkey PRIMARY KEY (id);


--
-- TOC entry 4771 (class 2606 OID 16670)
-- Name: account account_customerid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_customerid_fkey FOREIGN KEY (customerid) REFERENCES public.customer(id);


--
-- TOC entry 4772 (class 2606 OID 16675)
-- Name: account account_roleid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_roleid_fkey FOREIGN KEY (roleid) REFERENCES public.role(id);


--
-- TOC entry 4773 (class 2606 OID 16758)
-- Name: bookingdetails bookingdetails_bookingid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookingdetails
    ADD CONSTRAINT bookingdetails_bookingid_fkey FOREIGN KEY (bookingid) REFERENCES public.bookings(id) ON DELETE CASCADE;


--
-- TOC entry 4774 (class 2606 OID 16800)
-- Name: bookingdetails bookingdetails_roomid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookingdetails
    ADD CONSTRAINT bookingdetails_roomid_fkey FOREIGN KEY (roomid) REFERENCES public.room(id) ON DELETE CASCADE;


--
-- TOC entry 4769 (class 2606 OID 16655)
-- Name: bookings bookings_bookingstatusid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_bookingstatusid_fkey FOREIGN KEY (bookingstatusid) REFERENCES public.bookingstatus(id);


--
-- TOC entry 4770 (class 2606 OID 16795)
-- Name: bookings bookings_customerid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_customerid_fkey FOREIGN KEY (customerid) REFERENCES public.customer(id) ON DELETE CASCADE;


--
-- TOC entry 4766 (class 2606 OID 16619)
-- Name: room room_roomstatusid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.room
    ADD CONSTRAINT room_roomstatusid_fkey FOREIGN KEY (roomstatusid) REFERENCES public.roomstatus(id);


--
-- TOC entry 4767 (class 2606 OID 16614)
-- Name: room room_roomtypeid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.room
    ADD CONSTRAINT room_roomtypeid_fkey FOREIGN KEY (roomtypeid) REFERENCES public.roomtype(id);


--
-- TOC entry 4768 (class 2606 OID 16633)
-- Name: roomimage roomimage_roomid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roomimage
    ADD CONSTRAINT roomimage_roomid_fkey FOREIGN KEY (roomid) REFERENCES public.room(id);


-- Completed on 2024-10-12 16:42:14

--
-- PostgreSQL database dump complete
--

