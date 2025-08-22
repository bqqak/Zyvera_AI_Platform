"use client"
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import React, {useEffect, useState} from 'react';
import {UserDetailContext} from "@/context/UserDetailContext";
import {SelectedChapterIndexContext} from "@/context/SelectedChapterIndexContext";

function Provider({ children }) {
    const { user } = useUser();
    const [userDetail, setUserDetail] = useState();
    const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);
    useEffect(() => {
        if (!user) return;
        // Only attempt when we have a valid email
        const email = user?.primaryEmailAddress?.emailAddress;
        if (!email) return;
        CreateNewUser();
    }, [user]);

    const CreateNewUser = async () => {
        try {
            const result = await axios.post('/api/user', {
                name: user?.fullName,
                email: user?.primaryEmailAddress?.emailAddress,
            });
            console.log(result.data);
            setUserDetail(result.data);
        } catch (err) {
            console.error('Failed to create or fetch user:', err);
        }
    };

    return (
        <UserDetailContext.Provider value={{userDetail, setUserDetail}}>
            <SelectedChapterIndexContext.Provider value={{ selectedChapterIndex, setSelectedChapterIndex}}>
                <div>
                    {children}
                </div>
            </SelectedChapterIndexContext.Provider>
        </UserDetailContext.Provider>

    );
}
export default Provider;
