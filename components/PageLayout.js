import Nav from "./Nav";
import supabase from "../lib/supabaseClient";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function PageLayout({ children }) {
    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            handleAuthChange(event, session)
            if (event === 'SIGNED_OUT') {
                router.push("/login")
            }
            if (event === 'SIGNED_IN') {
                router.push('/profile')
            }
            console.log(event);
        })
        return () => {
            authListener.unsubscribe()
        }
    }, [])
    async function handleAuthChange(event, session) {
        await fetch('/api/auth', {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            credentials: 'same-origin',
            body: JSON.stringify({ event, session }),
        })
    }

    const router = useRouter();
    const paddingTop = ["/new", "/upload"].includes(router.pathname) ? '80px' : undefined;
    const noNavRoutes = ['/[slug]/watch'];
    return (
        <>
            {noNavRoutes.includes(router.pathname) ? <></> : <Nav />}
            <main style={{ paddingTop }}>{children}</main>
        </>
    )
}