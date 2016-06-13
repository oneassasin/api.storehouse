-- Database generated with pgModeler (PostgreSQL Database Modeler).
-- pgModeler  version: 0.8.2-beta1
-- PostgreSQL version: 9.0
-- Project Site: pgmodeler.com.br
-- Model Author: ---


-- Database creation must be done outside an multicommand file.
-- These commands were put in this file only for convenience.
-- -- object: storehouse | type: DATABASE --
-- -- DROP DATABASE IF EXISTS storehouse;
-- CREATE DATABASE storehouse
-- ;
-- -- ddl-end --
-- 

-- object: public.rfids | type: TABLE --
-- DROP TABLE IF EXISTS public.rfids CASCADE;
CREATE TABLE public.rfids(
	id bigserial NOT NULL,
	created_at timestamptz NOT NULL DEFAULT now(),
	value text NOT NULL,
	CONSTRAINT rfids_pk PRIMARY KEY (id)

);
-- ddl-end --
COMMENT ON TABLE public.rfids IS 'RDIF метки';
-- ddl-end --
ALTER TABLE public.rfids OWNER TO postgres;
-- ddl-end --

-- object: rfids_value_u_i | type: INDEX --
-- DROP INDEX IF EXISTS public.rfids_value_u_i CASCADE;
CREATE UNIQUE INDEX rfids_value_u_i ON public.rfids
	USING btree
	(
	  value
	);
-- ddl-end --

-- object: public.goods | type: TABLE --
-- DROP TABLE IF EXISTS public.goods CASCADE;
CREATE TABLE public.goods(
	id bigserial NOT NULL,
	name text NOT NULL,
	storehouse_id bigint NOT NULL,
	created_at timestamptz NOT NULL DEFAULT now(),
	CONSTRAINT goods_pk PRIMARY KEY (id)

);
-- ddl-end --
COMMENT ON TABLE public.goods IS 'Товары';
-- ddl-end --
ALTER TABLE public.goods OWNER TO postgres;
-- ddl-end --

-- object: public.storehouses | type: TABLE --
-- DROP TABLE IF EXISTS public.storehouses CASCADE;
CREATE TABLE public.storehouses(
	id bigserial NOT NULL,
	created_at timestamptz NOT NULL DEFAULT now(),
	name text NOT NULL,
	CONSTRAINT storehouses_pk PRIMARY KEY (id)

);
-- ddl-end --
COMMENT ON TABLE public.storehouses IS 'Склады в городах';
-- ddl-end --
ALTER TABLE public.storehouses OWNER TO postgres;
-- ddl-end --

-- object: public.storehouses_sectors | type: TABLE --
-- DROP TABLE IF EXISTS public.storehouses_sectors CASCADE;
CREATE TABLE public.storehouses_sectors(
	id bigserial NOT NULL,
	created_at timestamptz NOT NULL DEFAULT now(),
	name text NOT NULL,
	storehouse_id bigint NOT NULL,
	CONSTRAINT storehouses_sectors_pk PRIMARY KEY (id)

);
-- ddl-end --
COMMENT ON TABLE public.storehouses_sectors IS 'Сектора в складах';
-- ddl-end --
ALTER TABLE public.storehouses_sectors OWNER TO postgres;
-- ddl-end --

-- object: public.sectors_racks | type: TABLE --
-- DROP TABLE IF EXISTS public.sectors_racks CASCADE;
CREATE TABLE public.sectors_racks(
	id bigserial NOT NULL,
	created_at timestamptz NOT NULL DEFAULT now(),
	name text NOT NULL,
	sector_id bigint NOT NULL,
	CONSTRAINT racks_pk PRIMARY KEY (id)

);
-- ddl-end --
COMMENT ON TABLE public.sectors_racks IS 'Стеллажи в секторах';
-- ddl-end --
ALTER TABLE public.sectors_racks OWNER TO postgres;
-- ddl-end --

-- object: public.racks_shelfes | type: TABLE --
-- DROP TABLE IF EXISTS public.racks_shelfes CASCADE;
CREATE TABLE public.racks_shelfes(
	id bigserial NOT NULL,
	created_at timestamptz NOT NULL DEFAULT now(),
	number bigint NOT NULL,
	rack_id bigint NOT NULL,
	CONSTRAINT racks_shelf_pk PRIMARY KEY (id)

);
-- ddl-end --
COMMENT ON TABLE public.racks_shelfes IS 'Полки на стеллажах';
-- ddl-end --
ALTER TABLE public.racks_shelfes OWNER TO postgres;
-- ddl-end --

-- object: public.messages | type: TABLE --
-- DROP TABLE IF EXISTS public.messages CASCADE;
CREATE TABLE public.messages(
	id bigserial NOT NULL,
	created_at timestamptz NOT NULL DEFAULT now(),
	storehouse_id bigint NOT NULL,
	author_id bigint NOT NULL,
	message text NOT NULL,
	CONSTRAINT messages_pk PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE public.messages OWNER TO postgres;
-- ddl-end --

-- object: public.users | type: TABLE --
-- DROP TABLE IF EXISTS public.users CASCADE;
CREATE TABLE public.users(
	id bigserial NOT NULL,
	login text NOT NULL,
	password text NOT NULL,
	created_at timestamptz NOT NULL DEFAULT now(),
	user_role_id bigint NOT NULL,
	CONSTRAINT users_pk PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE public.users OWNER TO postgres;
-- ddl-end --

-- object: public.sessions | type: TABLE --
-- DROP TABLE IF EXISTS public.sessions CASCADE;
CREATE TABLE public.sessions(
	user_id bigint NOT NULL,
	session text NOT NULL,
	expired timestamptz NOT NULL,
	CONSTRAINT sessions_pk PRIMARY KEY (user_id)

);
-- ddl-end --
ALTER TABLE public.sessions OWNER TO postgres;
-- ddl-end --

-- object: public.pathes | type: TABLE --
-- DROP TABLE IF EXISTS public.pathes CASCADE;
CREATE TABLE public.pathes(
	id bigserial NOT NULL,
	path text NOT NULL,
	method text NOT NULL,
	CONSTRAINT permissions_pk PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE public.pathes OWNER TO postgres;
-- ddl-end --

-- object: public.user_roles | type: TABLE --
-- DROP TABLE IF EXISTS public.user_roles CASCADE;
CREATE TABLE public.user_roles(
	id bigserial NOT NULL,
	name text NOT NULL,
	CONSTRAINT user_roles_pk PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE public.user_roles OWNER TO postgres;
-- ddl-end --

-- object: public.user_role_permissions | type: TABLE --
-- DROP TABLE IF EXISTS public.user_role_permissions CASCADE;
CREATE TABLE public.user_role_permissions(
	user_role_id bigint NOT NULL,
	path_id bigint NOT NULL,
	denied bit NOT NULL DEFAULT b'1'
);
-- ddl-end --
ALTER TABLE public.user_role_permissions OWNER TO postgres;
-- ddl-end --

-- object: public.goods_rfids | type: TABLE --
-- DROP TABLE IF EXISTS public.goods_rfids CASCADE;
CREATE TABLE public.goods_rfids(
	rfid_id bigint NOT NULL,
	good_id bigint NOT NULL,
	created_at timestamptz NOT NULL DEFAULT now(),
	shelf_id bigint NOT NULL,
	shipment_at timestamptz NOT NULL,
	priority bigint NOT NULL DEFAULT 0
);
-- ddl-end --
ALTER TABLE public.goods_rfids OWNER TO postgres;
-- ddl-end --

-- object: goods_u_i | type: INDEX --
-- DROP INDEX IF EXISTS public.goods_u_i CASCADE;
CREATE UNIQUE INDEX goods_u_i ON public.goods
	USING btree
	(
	  name
	);
-- ddl-end --

-- object: goods_rfids_u_i | type: INDEX --
-- DROP INDEX IF EXISTS public.goods_rfids_u_i CASCADE;
CREATE UNIQUE INDEX goods_rfids_u_i ON public.goods_rfids
	USING btree
	(
	  rfid_id,
	  good_id ASC NULLS LAST
	);
-- ddl-end --

-- object: goods_storehouse_id_fk | type: CONSTRAINT --
-- ALTER TABLE public.goods DROP CONSTRAINT IF EXISTS goods_storehouse_id_fk CASCADE;
ALTER TABLE public.goods ADD CONSTRAINT goods_storehouse_id_fk FOREIGN KEY (storehouse_id)
REFERENCES public.storehouses (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: storehouses_sectors_storehouse_id_fk | type: CONSTRAINT --
-- ALTER TABLE public.storehouses_sectors DROP CONSTRAINT IF EXISTS storehouses_sectors_storehouse_id_fk CASCADE;
ALTER TABLE public.storehouses_sectors ADD CONSTRAINT storehouses_sectors_storehouse_id_fk FOREIGN KEY (storehouse_id)
REFERENCES public.storehouses (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: sectors_racks_sector_id_fk | type: CONSTRAINT --
-- ALTER TABLE public.sectors_racks DROP CONSTRAINT IF EXISTS sectors_racks_sector_id_fk CASCADE;
ALTER TABLE public.sectors_racks ADD CONSTRAINT sectors_racks_sector_id_fk FOREIGN KEY (sector_id)
REFERENCES public.storehouses_sectors (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: racks_shelfes_rack_id_fk | type: CONSTRAINT --
-- ALTER TABLE public.racks_shelfes DROP CONSTRAINT IF EXISTS racks_shelfes_rack_id_fk CASCADE;
ALTER TABLE public.racks_shelfes ADD CONSTRAINT racks_shelfes_rack_id_fk FOREIGN KEY (rack_id)
REFERENCES public.sectors_racks (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: messages_storehouse_id_fk | type: CONSTRAINT --
-- ALTER TABLE public.messages DROP CONSTRAINT IF EXISTS messages_storehouse_id_fk CASCADE;
ALTER TABLE public.messages ADD CONSTRAINT messages_storehouse_id_fk FOREIGN KEY (storehouse_id)
REFERENCES public.storehouses (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: messages_author_id_fk | type: CONSTRAINT --
-- ALTER TABLE public.messages DROP CONSTRAINT IF EXISTS messages_author_id_fk CASCADE;
ALTER TABLE public.messages ADD CONSTRAINT messages_author_id_fk FOREIGN KEY (author_id)
REFERENCES public.users (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: users_user_role_id_fk | type: CONSTRAINT --
-- ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_user_role_id_fk CASCADE;
ALTER TABLE public.users ADD CONSTRAINT users_user_role_id_fk FOREIGN KEY (user_role_id)
REFERENCES public.user_roles (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: sessions_user_id_fk | type: CONSTRAINT --
-- ALTER TABLE public.sessions DROP CONSTRAINT IF EXISTS sessions_user_id_fk CASCADE;
ALTER TABLE public.sessions ADD CONSTRAINT sessions_user_id_fk FOREIGN KEY (user_id)
REFERENCES public.users (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: user_role_permissions_user_role_id_fk | type: CONSTRAINT --
-- ALTER TABLE public.user_role_permissions DROP CONSTRAINT IF EXISTS user_role_permissions_user_role_id_fk CASCADE;
ALTER TABLE public.user_role_permissions ADD CONSTRAINT user_role_permissions_user_role_id_fk FOREIGN KEY (user_role_id)
REFERENCES public.user_roles (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: user_role_permissions_path_id_fk | type: CONSTRAINT --
-- ALTER TABLE public.user_role_permissions DROP CONSTRAINT IF EXISTS user_role_permissions_path_id_fk CASCADE;
ALTER TABLE public.user_role_permissions ADD CONSTRAINT user_role_permissions_path_id_fk FOREIGN KEY (path_id)
REFERENCES public.pathes (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: goods_rfids_rfid_id_fk | type: CONSTRAINT --
-- ALTER TABLE public.goods_rfids DROP CONSTRAINT IF EXISTS goods_rfids_rfid_id_fk CASCADE;
ALTER TABLE public.goods_rfids ADD CONSTRAINT goods_rfids_rfid_id_fk FOREIGN KEY (rfid_id)
REFERENCES public.rfids (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: goods_rfids_good_id_fk | type: CONSTRAINT --
-- ALTER TABLE public.goods_rfids DROP CONSTRAINT IF EXISTS goods_rfids_good_id_fk CASCADE;
ALTER TABLE public.goods_rfids ADD CONSTRAINT goods_rfids_good_id_fk FOREIGN KEY (good_id)
REFERENCES public.goods (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: goods_rfids_shelf_id_fk | type: CONSTRAINT --
-- ALTER TABLE public.goods_rfids DROP CONSTRAINT IF EXISTS goods_rfids_shelf_id_fk CASCADE;
ALTER TABLE public.goods_rfids ADD CONSTRAINT goods_rfids_shelf_id_fk FOREIGN KEY (shelf_id)
REFERENCES public.racks_shelfes (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --


