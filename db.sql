-- create a cart
CREATE TABLE cart
(
    p_id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    p_name character varying(20) COLLATE pg_catalog."default",
    p_price integer,
    quantity integer DEFAULT 1,
    p_img text COLLATE pg_catalog."default",
    CONSTRAINT cart_pkey PRIMARY KEY (p_id)
);

-- create a feedback
CREATE TABLE feedback
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    username character varying(20) COLLATE pg_catalog."default" NOT NULL,
    stars integer NOT NULL,
    feedback character varying(150) COLLATE pg_catalog."default" NOT NULL,
    userid integer NOT NULL,
    CONSTRAINT feedback_pkey PRIMARY KEY (id)
);

-- create a products
CREATE TABLE products
(
    id integer NOT NULL,
    name character varying(20) COLLATE pg_catalog."default" NOT NULL,
    price integer NOT NULL,
    discount integer,
    img text COLLATE pg_catalog."default",
    CONSTRAINT products_pkey PRIMARY KEY (id)
);

-- create a users
CREATE TABLE users
(
    fname character varying(20) COLLATE pg_catalog."default" NOT NULL,
    lname character varying(20) COLLATE pg_catalog."default" NOT NULL,
    username character varying(20) COLLATE pg_catalog."default" NOT NULL,
    password character varying(20) COLLATE pg_catalog."default" NOT NULL,
    email character varying(30) COLLATE pg_catalog."default" NOT NULL,
    uid integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    auth integer DEFAULT 2,
    CONSTRAINT users_pkey PRIMARY KEY (username, uid)
);