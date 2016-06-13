CREATE OR REPLACE 
FUNCTION init() RETURNS sessions AS $$
DECLARE 
	i bigint := -1;
	_pathes bigint := -1;
	_user_role_id bigint := -1;
	_user_id bigint := -1;
	_result sessions; 
BEGIN	
	INSERT INTO pathes(path, method) VALUES ('POST', '^\/user\/auth\/$'), 
										('DELETE', '^\/user\/auth\/$'),
										('GET', '^\/storehouses\/[0-9]+\/messages$'),
										('POST', '^\/storehouses\/[0-9]+\/messages$'),
										('GET', '^\/storehouses\/[0-9]+\/goods$'),
										('POST', '^\/storehouses\/[0-9]+\/goods$'),
										('GET', '^\/rfids\/$'),
										('POST', '^\/rfids\/$'),
										('GET', '^\/storehouses\/[0-9]+\/sectors\/$'),
										('POST', '^\/storehouses\/[0-9]+\/sectors\/$'),
										('GET', '^^\/sectors\/[0-9]+\/racks$'),
										('POST', '^\/sectors\/[0-9]+\/racks$'),
										('GET', '^\/racks\/[0-9]+\/shelfes$'),
										('POST', '^\/racks\/[0-9]+\/shelfes$'),
										('GET', '^\/storehouses\/$'),
										('POST', '^\/storehouses\/$'),
										('GET', '^\/storehouses\/[0-9]+\/items$'),
										('POST', '^\/storehouses\/[0-9]+\/items$');

	INSERT INTO 
	user_roles (name)
	VALUES     ('admin')
	RETURNING id INTO _user_role_id;

	FOR i IN 
		SELECT id FROM pathes 
	LOOP
		INSERT INTO user_role_permissions(user_role_id, path_id, denied) VALUES(_user_role_id, i, b'0');
	END LOOP;

	INSERT INTO 
	users  (login, password, user_role_id)
	VALUES ('admin@storehouse.ru', '7b2e9f54cdff413fcde01f330af6896c3cd7e6cd', _user_role_id)
	RETURNING id INTO _user_id;

	INSERT INTO 
	sessions (user_id, session, expired)
	VALUES   (_user_id, 'asdasd', now()::timestamptz + interval '1 day')
	RETURNING * INTO _result;

	RETURN _result;	
END;
$$ LANGUAGE plpgsql;

SELECT init();