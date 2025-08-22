import React from 'react';

function WelcomeBanner() {
    return(
        <div className={'p-5 bg-gradient-to-br from-sky-50 via-blue-200 to-cyan-100 rounded-xl'}>
            <h2 className={'font-bold text-2xl text-slate-900'}>Welcome to Online Learning Platform</h2>
            <p className={'text-slate-700'}>Learn, Create and Explore Your favorite courses</p>
        </div>
    )
}
export default WelcomeBanner