import { auth } from '@clerk/nextjs/server';
import React from 'react';
import { redirect } from 'next/navigation';

const Profile = async () => {
    const { userId } = await auth();
    const isAuth = !!userId;

    if (!isAuth) {
        redirect("/");
    }

    return (
        <div>
            <h1>Profile</h1>
            <div className="username">
                <strong>Username:</strong>
            </div>
        </div>
    );
};

export default Profile;
