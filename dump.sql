--
-- PostgreSQL database dump
--

-- Dumped from database version 14.10 (Homebrew)
-- Dumped by pg_dump version 14.10 (Homebrew)

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
-- Name: basket_master; Type: TABLE; Schema: public; Owner: akash
--

CREATE TABLE public.basket_master (
    basket_name character varying(255),
    holdings json
);


ALTER TABLE public.basket_master OWNER TO akash;

--
-- Name: cars; Type: TABLE; Schema: public; Owner: akash
--

CREATE TABLE public.cars (
    brand character varying(255),
    model character varying(255),
    year integer
);


ALTER TABLE public.cars OWNER TO akash;

--
-- Name: session_master; Type: TABLE; Schema: public; Owner: akash
--

CREATE TABLE public.session_master (
    wallet_address character varying(255),
    session_key character varying(255),
    amount bigint,
    last_transaction_date date,
    repeat_duration integer,
    basket_name character varying(255)
);


ALTER TABLE public.session_master OWNER TO akash;

--
-- Name: user_master; Type: TABLE; Schema: public; Owner: akash
--

CREATE TABLE public.user_master (
    wallet_address character varying(255),
    session_active boolean,
    session_key character varying(255),
    holdings json
);


ALTER TABLE public.user_master OWNER TO akash;

--
-- Data for Name: basket_master; Type: TABLE DATA; Schema: public; Owner: akash
--

COPY public.basket_master (basket_name, holdings) FROM stdin;
basket_1	{\n  "ETH": 30,\n  "DAI": 70\n}
\.


--
-- Data for Name: cars; Type: TABLE DATA; Schema: public; Owner: akash
--

COPY public.cars (brand, model, year) FROM stdin;
mercedes	maybach	1934
ferarri	f1	1944
ford	mustang	1956
\.


--
-- Data for Name: session_master; Type: TABLE DATA; Schema: public; Owner: akash
--

COPY public.session_master (wallet_address, session_key, amount, last_transaction_date, repeat_duration, basket_name) FROM stdin;
\N	12	10	\N	10	basket_1
\N	0x08ba090ce90aa34864b8bf3122e4c87d8c210d76b7aa19c640b691849c48e38a	1	\N	1	basket_1
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	0xc6445463ad5f71b152e16d4d25253e5b217140eb9ba9ee651c8ad4254f1018d8	1	\N	1	basket_1
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	0x551d4ebaa09e07de938c71da0e56fcd59bce21dbb9b12f3f6d3765d054a482bc	1	\N	1	basket_1
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	0x535cda88a0462cf1d4b04a152bf5977c4ef9990a2c2b0fd8d89425e869e8437d	1	\N	1	basket_1
\.


--
-- Data for Name: user_master; Type: TABLE DATA; Schema: public; Owner: akash
--

COPY public.user_master (wallet_address, session_active, session_key, holdings) FROM stdin;
123	t	12	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	t	0x535cda88a0462cf1d4b04a152bf5977c4ef9990a2c2b0fd8d89425e869e8437d	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	t	0x535cda88a0462cf1d4b04a152bf5977c4ef9990a2c2b0fd8d89425e869e8437d	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	t	0x535cda88a0462cf1d4b04a152bf5977c4ef9990a2c2b0fd8d89425e869e8437d	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	t	0x535cda88a0462cf1d4b04a152bf5977c4ef9990a2c2b0fd8d89425e869e8437d	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	t	0x535cda88a0462cf1d4b04a152bf5977c4ef9990a2c2b0fd8d89425e869e8437d	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	t	0x535cda88a0462cf1d4b04a152bf5977c4ef9990a2c2b0fd8d89425e869e8437d	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	t	0x535cda88a0462cf1d4b04a152bf5977c4ef9990a2c2b0fd8d89425e869e8437d	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	t	0x535cda88a0462cf1d4b04a152bf5977c4ef9990a2c2b0fd8d89425e869e8437d	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	t	0x535cda88a0462cf1d4b04a152bf5977c4ef9990a2c2b0fd8d89425e869e8437d	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	t	0x535cda88a0462cf1d4b04a152bf5977c4ef9990a2c2b0fd8d89425e869e8437d	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	\N	\N	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	\N	\N	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	\N	\N	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	\N	\N	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	\N	\N	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	\N	\N	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	\N	\N	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	\N	\N	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	\N	\N	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	\N	\N	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	\N	\N	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	\N	\N	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	\N	\N	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	\N	\N	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	\N	\N	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	\N	\N	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	\N	\N	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	\N	\N	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	\N	\N	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	\N	\N	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	\N	\N	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	\N	\N	\N
0x01358d634605bbeab965285c3d6ca1903efb8f92	\N	\N	\N
0x01358d634605bbeab965285c3d6ca1903efb8f92	\N	\N	\N
0x01358d634605bbeab965285c3d6ca1903efb8f92	\N	\N	\N
0x01358d634605bbeab965285c3d6ca1903efb8f92	\N	\N	\N
0x01358d634605bbeab965285c3d6ca1903efb8f92	\N	\N	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	t	0x535cda88a0462cf1d4b04a152bf5977c4ef9990a2c2b0fd8d89425e869e8437d	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	t	0x535cda88a0462cf1d4b04a152bf5977c4ef9990a2c2b0fd8d89425e869e8437d	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	t	0x535cda88a0462cf1d4b04a152bf5977c4ef9990a2c2b0fd8d89425e869e8437d	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	t	0x535cda88a0462cf1d4b04a152bf5977c4ef9990a2c2b0fd8d89425e869e8437d	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	t	0x535cda88a0462cf1d4b04a152bf5977c4ef9990a2c2b0fd8d89425e869e8437d	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	t	0x535cda88a0462cf1d4b04a152bf5977c4ef9990a2c2b0fd8d89425e869e8437d	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	t	0x535cda88a0462cf1d4b04a152bf5977c4ef9990a2c2b0fd8d89425e869e8437d	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	t	0x535cda88a0462cf1d4b04a152bf5977c4ef9990a2c2b0fd8d89425e869e8437d	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	t	0x535cda88a0462cf1d4b04a152bf5977c4ef9990a2c2b0fd8d89425e869e8437d	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	t	0x535cda88a0462cf1d4b04a152bf5977c4ef9990a2c2b0fd8d89425e869e8437d	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	\N	\N	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	\N	\N	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	\N	\N	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	\N	\N	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	\N	\N	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	\N	\N	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	\N	\N	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	\N	\N	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	\N	\N	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	\N	\N	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	\N	\N	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	\N	\N	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	\N	\N	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	\N	\N	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	\N	\N	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	\N	\N	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	\N	\N	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	\N	\N	\N
0x791b5d49c2b320a3e2da2cbe1905356d2647746c	\N	\N	\N
0x01358d634605bbeab965285c3d6ca1903efb8f92	\N	\N	\N
0x01358d634605bbeab965285c3d6ca1903efb8f92	\N	\N	\N
0x01358d634605bbeab965285c3d6ca1903efb8f92	\N	\N	\N
0x01358d634605bbeab965285c3d6ca1903efb8f92	\N	\N	\N
0x01358d634605bbeab965285c3d6ca1903efb8f92	\N	\N	\N
\.


--
-- PostgreSQL database dump complete
--

