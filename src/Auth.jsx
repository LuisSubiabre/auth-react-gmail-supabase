import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

const Auth = () => {
    const [user, setUser] = useState(null);
    const [isAllowed, setIsAllowed] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
            // Obtener usuario autenticado
            const { data: userData, error } = await supabase.auth.getUser();

            if (error) {
                console.error('Error al obtener usuario:', error.message);
                return;
            }

            const user = userData?.user;
            setUser(user);

            if (user) {
                // Verificar si el correo está en la base de datos
                const { data: allowedEmails, error: dbError } = await supabase
                    .from('allowed_emails')
                    .select('email')
                    .eq('email', user.email);

                if (dbError) {
                    console.error('Error al verificar el correo:', dbError.message);
                    return;
                }

                // Actualizar estado según validación
                setIsAllowed(allowedEmails.length > 0);
            }
        };

        checkUser();
    }, []);

    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
        });

        if (error) console.error('Error de autenticación:', error.message);
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    if (!user) {
        return <button onClick={signInWithGoogle}>Iniciar sesión con Google</button>;
    }

    if (isAllowed) {
        return (
            <div>
                <h1>Bienvenido, {user.email}</h1>
                <button onClick={signOut}>Cerrar sesión</button>
            </div>
        );
    }

    return (
        <div>
            <h1>Acceso denegado para {user.email}</h1>
            <button onClick={signOut}>Cerrar sesión</button>
        </div>
    );
};

export default Auth;
