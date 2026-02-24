import React, { useState, useEffect, useRef } from 'react';
import { getUser } from '../utils/Common';

const Home = () => {
    const user = getUser();
    return (
        <>
            <div className="page-header-wrp mb-0">
                <div className="title-breadcrumb-wrp">
                    <h1 className="">Home</h1>
                </div>
            </div>

            <div className="container-fluid pt-4">
                <div className="row">
                    <div class="col-lg-12 text-center">
                        {/* <h1 class="mt-5">InQube Shop Floor System</h1> */}
                        <p class="lead">Hello {user && user.name}</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;