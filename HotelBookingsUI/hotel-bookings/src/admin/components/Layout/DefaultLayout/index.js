import styles from './DefaultLayout.module.scss'
import classNames from 'classnames/bind';
import React from 'react';
import Sidebar from '../Sidebar';

const cx = classNames.bind(styles)

function DefaultLayout({children}) {
    return (
        <div className="d-flex">
            <Sidebar />
            <div className="p-4" style={{ width: '100%' }}>
                {children}
            </div>
        </div>
    );
}

export default DefaultLayout;